import { ref } from 'valtio'

import { eventBus } from '../../../lib'
import type { Character } from '../../character/character.types'
import type {
	DialogueDefinition,
	DialogueNode,
	DialogueOption,
	DialogueParticipant,
	QuestDialogueDefinition,
} from '../dsl/dialogue-definition.type'
import { dialogueStore } from './dialogue.store'

export abstract class AbstractDialogue {
	id: string
	protected nodes: Record<string, DialogueNode<string>>
	protected currentNodeId: string
	awaitingChoice: boolean
	protected startedAt: number
	timer: { value: number }
	protected currentLineIndex: number
	protected participants: readonly DialogueParticipant<string>[]
	protected extensions: QuestDialogueDefinition<string>[] = []

	protected constructor(
		dialogue: DialogueDefinition<Character<string>['id']>,
		extensions: QuestDialogueDefinition<string>[] = [],
	) {
		this.id = dialogue.id
		this.startedAt = Temporal.Now.instant().epochMilliseconds
		this.awaitingChoice = !!dialogue.nodes[dialogue.entryNodeId]?.choice?.options.length
		this.currentNodeId = dialogue.entryNodeId
		this.timer = ref({ value: 0 })
		this.currentLineIndex = 0

		this.participants = dialogue.participants
		this.extensions = extensions

		this.nodes = {
			...dialogue.nodes,
			...extensions.reduce((acc, { nodes }) => ({ ...acc, ...nodes }), {}),
		}

		eventBus.emit('dialogue_started', { dialogueId: this.id })
	}

	private nextLine() {
		if (!this.node) {
			console.warn(`Node with id "${this.currentNodeId}" not found in dialogue "${this.id}".`)
			return false
		}

		if (this.currentLineIndex < this.node.lines.length - 1) {
			this.currentLineIndex++
			return true
		}

		return false
	}

	private nextNode() {
		if (!this.node) {
			console.warn(`Node with id "${this.currentNodeId}" not found in dialogue "${this.id}".`)
			return false
		}

		if (this.node.nextNodeId) {
			this.currentNodeId = this.node.nextNodeId
			this.currentLineIndex = 0
			this.awaitingChoice = !!this.node?.choice?.options.length
			return true
		}

		return false
	}

	next() {
		this.timer.value = 0

		if (this.awaitingChoice) return this
		if (this.nextLine()) return this
		eventBus.emit('dialogue_node_ended', { dialogueId: this.id, nodeId: this.currentNodeId })

		if (this.nextNode()) return this
		return this.end()
	}

	choose(choice: DialogueOption) {
		if (!this.awaitingChoice) {
			console.warn('No choices available at this time.')
			return this
		}

		const validOption = this.node?.choice?.options.find(({ label }) => label === choice.label)

		if (!validOption) {
			console.warn(`Invalid choice: ${choice.label}`)
			return this
		}

		this.currentNodeId = validOption.nextNodeId
		this.currentLineIndex = 0
		this.awaitingChoice = !!this.node?.choice?.options.length

		return this
	}

	end() {
		eventBus.emit('dialogue_ended', { dialogueId: this.id })
	}

	get node() {
		const node = this.nodes[this.currentNodeId]
		if (!node) return undefined

		if (!node.choice?.type || node.choice.type === 'extensible') {
			return {
				...node,
				choice: node.choice
					? {
							...node.choice,
							options: [
								...node.choice.options,
								...this.extensions.map(({ option }) => ({
									label: option.label,
									nextNodeId: option.nextNodeId,
								})),
							],
						}
					: node.choice,
			}
		}

		return node
	}

	get line() {
		return this.node?.lines[this.currentLineIndex]
	}

	get choice() {
		return this.node?.choice
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
		extensions: QuestDialogueDefinition<string>[],
		{ locked = true }: { locked?: boolean },
	) {
		super(dialogue, extensions)
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
	...extensions: QuestDialogueDefinition<string>[]
): AbstractDialogue {
	return dialogue.isNpcOnly
		? new NpcDialogue(dialogue)
		: new PlayerDialogue(dialogue, extensions, { locked: dialogue.locked })
}
