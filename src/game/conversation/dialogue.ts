import type { Character } from '../character/types/character'
import { game } from '../game.store'
import type {
	DialogueDefinition,
	DialogueNode,
	DialogueOption,
	DialogueParticipant,
} from './types/dialogue'

export abstract class AbstractDialogue {
	id: string
	protected nodes: Record<string, DialogueNode<string>>
	protected currentNodeId: string
	awaitingChoice: boolean
	protected startedAt: number
	timer: number
	protected currentLineIndex: number
	protected participants: readonly DialogueParticipant<string>[]

	constructor(dialogue: DialogueDefinition<Character<string>['id']>) {
		this.id = dialogue.id
		this.startedAt = Date.now()
		this.awaitingChoice = !!dialogue.nodes[dialogue.entryNodeId]?.choice?.length
		this.currentNodeId = dialogue.entryNodeId
		this.timer = 0
		this.currentLineIndex = 0

		this.participants = dialogue.participants
		this.nodes = dialogue.nodes
	}

	private nextLine() {
		const node = this.nodes[this.currentNodeId]
		if (!node) {
			console.warn(`Node with id "${this.currentNodeId}" not found in dialogue "${this.id}".`)
			return false
		}

		if (this.currentLineIndex < node.lines.length - 1) {
			this.currentLineIndex++
			return true
		}

		return false
	}

	private nextNode() {
		const node = this.nodes[this.currentNodeId]
		if (!node) {
			console.warn(`Node with id "${this.currentNodeId}" not found in dialogue "${this.id}".`)
			return false
		}

		if (node.nextNodeId) {
			this.currentNodeId = node.nextNodeId
			this.currentLineIndex = 0
			this.awaitingChoice = !!this.nodes[this.currentNodeId]?.choice?.length
			return true
		}

		return false
	}

	next() {
		if (this.awaitingChoice) return this

		if (this.nextLine()) return this
		if (this.nextNode()) return this

		console.log(`Dialogue "${this.id}" has ended.`)
		return undefined
	}

	choose(choice: DialogueOption) {
		if (!this.awaitingChoice) {
			console.warn('No choices available at this time.')
			return this
		}

		const node = this.nodes[this.currentNodeId]
		const validOption = node?.choice?.find(({ label }) => label === choice.label)

		if (!validOption) {
			console.warn(`Invalid choice: ${choice.label}`)
			return this
		}

		this.currentNodeId = validOption.nextNodeId
		this.currentLineIndex = 0
		this.awaitingChoice = !!this.nodes[this.currentNodeId]?.choice?.length

		return this
	}

	get line() {
		const node = this.nodes[this.currentNodeId]
		return node?.lines[this.currentLineIndex]
	}

	get choices() {
		const node = this.nodes[this.currentNodeId]
		return node?.choice
	}
}

export class NpcDialogue extends AbstractDialogue {
	private remove() {
		const dialogueIndex = game.dialogue.all.indexOf(this)

		if (dialogueIndex !== -1) game.dialogue.all.splice(dialogueIndex, 1)
		else console.warn(`Dialogue with id ${this.id} not found in dialogues array.`)
	}

	override next() {
		const dialogue = super.next()

		if (!dialogue) {
			this.remove()
			return
		}

		return this
	}
}

export class PlayerDialogue extends AbstractDialogue {
	constructor(dialogue: DialogueDefinition<Character<string>['id']>) {
		super(dialogue)
		game.pointerLockControls.current?.unlock()
		game.dialogue.active = this
	}

	override next() {
		const dialogue = super.next()

		if (!dialogue) {
			game.pointerLockControls.current?.lock()
			game.dialogue.active = undefined
			return
		}

		return this
	}
}
