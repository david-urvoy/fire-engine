import type { Character } from '../character/character'
import { game } from '../game.store'
import type {
	DialogueChoice,
	DialogueNode,
	DialogueParticipant,
	GroupDialogue,
	SimpleDialogue,
} from './types/dialogue'

function isGroupDialogue<C extends Character<string>>(
	dialogue: SimpleDialogue<C> | GroupDialogue<C>,
): dialogue is GroupDialogue<C> {
	return dialogue.kind === 'multi'
}

export abstract class AbstractDialogue {
	id: string
	protected nodes: Record<string, DialogueNode<string>>
	protected currentNodeId: string
	awaitingChoice: boolean
	protected startedAt: number
	timer: number
	protected currentLineIndex: number
	protected participants: readonly DialogueParticipant<string>[]

	constructor(dialogue: SimpleDialogue<Character<string>> | GroupDialogue<Character<string>>) {
		this.id = dialogue.id
		this.startedAt = Date.now()
		this.awaitingChoice = !!dialogue.nodes[dialogue.entryNodeId]?.choices?.length
		this.currentNodeId = dialogue.entryNodeId
		this.timer = 0
		this.currentLineIndex = 0

		const isGroup = isGroupDialogue(dialogue)

		if (isGroup) {
			this.participants = dialogue.participants
			this.nodes = dialogue.nodes
		} else {
			this.participants = [{ id: dialogue.speakerId, role: 'npc', required: true }]
			this.nodes = Object.fromEntries(
				Object.entries(dialogue.nodes).map(([nodeId, node]) => [
					nodeId,
					{
						lines: node.lines.map((line) => ({
							speakerId: dialogue.speakerId,
							text: line,
						})),
						choices: node.choices,
						nextNodeId: node.nextNodeId,
					},
				]),
			)
		}
	}

	next() {
		if (this.awaitingChoice) return this

		const node = this.nodes[this.currentNodeId]
		const next = node?.nextNodeId

		if (!next) return

		this.currentNodeId = next
		this.currentLineIndex = 0
		this.awaitingChoice = !!node.choices?.length

		return this
	}

	choose(choice: DialogueChoice) {
		if (!this.awaitingChoice) {
			console.warn('No choices available at this time.')
			return this
		}

		const node = this.nodes[this.currentNodeId]
		const validChoice = node?.choices?.find(({ label }) => label === choice.label)

		if (!validChoice) {
			console.warn(`Invalid choice: ${choice.label}`)
			return this
		}

		this.currentNodeId = validChoice.nextNodeId
		this.currentLineIndex = 0
		this.awaitingChoice = !!this.nodes[this.currentNodeId]?.choices?.length

		return this
	}

	get line() {
		const node = this.nodes[this.currentNodeId]
		return node?.lines[this.currentLineIndex]
	}

	get choices() {
		const node = this.nodes[this.currentNodeId]
		return node?.choices
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
	override next() {
		const dialogue = super.next()

		if (!dialogue) {
			game.dialogue.active = undefined
			return
		}

		return this
	}
}
