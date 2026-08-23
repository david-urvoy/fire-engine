import { eventBus } from '../../../lib'
import type { Character } from '../../character/character.types'
import type {
	DialogueDefinition,
	DialogueNode,
	DialogueOption,
	DialogueParticipant,
} from '../dsl/dialogue-definition.type'
import { dialogueStore } from './dialogue.store'

export abstract class AbstractDialogue {
	id: string
	protected nodes: Record<string, DialogueNode<string>>
	protected currentNodeId: string
	awaitingChoice: boolean
	protected startedAt: number
	timer: number
	protected currentLineIndex: number
	protected participants: readonly DialogueParticipant<string>[]

	protected constructor(dialogue: DialogueDefinition<Character<string>['id']>) {
		this.id = dialogue.id
		this.startedAt = Date.now()
		this.awaitingChoice = !!dialogue.nodes[dialogue.entryNodeId]?.choice?.options.length
		this.currentNodeId = dialogue.entryNodeId
		this.timer = 0
		this.currentLineIndex = 0

		this.participants = dialogue.participants
		this.nodes = dialogue.nodes
		eventBus.emit('dialogue_started', { dialogueId: this.id })
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
			this.awaitingChoice = !!this.nodes[this.currentNodeId]?.choice?.options.length
			return true
		}

		return false
	}

	next() {
		if (this.awaitingChoice) return this

		if (this.nextLine()) return this
		if (this.nextNode()) return this

		return this.end()
	}

	choose(choice: DialogueOption) {
		if (!this.awaitingChoice) {
			console.warn('No choices available at this time.')
			return this
		}

		const node = this.nodes[this.currentNodeId]
		const validOption = node?.choice?.options.find(({ label }) => label === choice.label)

		if (!validOption) {
			console.warn(`Invalid choice: ${choice.label}`)
			return this
		}

		this.currentNodeId = validOption.nextNodeId
		this.currentLineIndex = 0
		this.awaitingChoice = !!this.nodes[this.currentNodeId]?.choice?.options.length

		return this
	}

	end() {
		eventBus.emit('dialogue_ended', { dialogueId: this.id })
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
	public constructor(dialogue: DialogueDefinition<Character<string>['id']>) {
		super(dialogue)
	}

	override end() {
		super.end()
		const dialogueIndex = dialogueStore.all.indexOf(this)

		if (dialogueIndex !== -1) dialogueStore.all.splice(dialogueIndex, 1)
		else console.warn(`Dialogue with id ${this.id} not found in dialogues array.`)
	}
}

export class PlayerDialogue extends AbstractDialogue {
	locked = true

	public constructor(
		dialogue: DialogueDefinition<Character<string>['id']>,
		{
			locked = true,
		}: {
			locked?: boolean
		},
	) {
		super(dialogue)
		dialogueStore.active = this
		this.locked = locked
	}

	override end() {
		super.end()
		dialogueStore.active = undefined
	}
}

export function createDialogue(
	dialogue: DialogueDefinition<Character<string>['id']>,
): AbstractDialogue {
	return dialogue.isNpcOnly
		? new NpcDialogue(dialogue)
		: new PlayerDialogue(dialogue, { locked: dialogue.locked })
}
