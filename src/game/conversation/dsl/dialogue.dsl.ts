import type { Character } from '../../character/character'
import type { DialogueDefinition, DialogueNode, DialogueParticipant } from '../types/dialogue'

export class DialogueBuilder<
	AllowedId extends string = never,
	ParticipantId extends AllowedId = never,
> {
	private nodes: Record<string, DialogueNode<ParticipantId>> = {}
	private entryNodeId = ''
	private participants: DialogueParticipant<ParticipantId>[] = []
	private isNpcOnly = true

	constructor(private readonly dialogueId: string) {}

	withParticipants<const Id extends AllowedId>(
		requiredIds: readonly Id[],
		optionalIds: readonly Id[] = [],
	): DialogueBuilder<AllowedId, ParticipantId | Id> {
		const self = this as DialogueBuilder<AllowedId, ParticipantId | Id>
		self.participants.push(...requiredIds.map((id) => ({ id, required: true })))
		self.participants.push(...optionalIds.map((id) => ({ id, required: false })))

		return self
	}

	npcOnly() {
		this.isNpcOnly = false
		return this
	}

	node(nodeId: string, input: DialogueNode<ParticipantId>) {
		if (this.nodes[nodeId]) {
			throw new Error(`Node "${nodeId}" is already defined.`)
		}

		const lines = (input.lines ?? []).map((line, index) => ({
			id: `${nodeId}_line_${index + 1}`,
			speakerId: line.speakerId,
			text: line.text,
		}))

		const choices = (input.choice ?? []).map((choice, index) => {
			return {
				id: `${nodeId}_choice_${index + 1}`,
				label: choice.label,
				nextNodeId: choice.nextNodeId,
			}
		})

		this.nodes[nodeId] = {
			lines,
			choice: choices.length ? choices : undefined,
			nextNodeId: input.nextNodeId,
		}

		if (!this.entryNodeId) this.entryNodeId = nodeId

		return this
	}

	done(): DialogueDefinition<Character<ParticipantId>, ParticipantId> {
		if (!this.entryNodeId) {
			throw new Error('A dialogue must define at least one node before done().')
		}

		return {
			id: this.dialogueId,
			participants: this.participants,
			entryNodeId: this.entryNodeId,
			nodes: this.nodes,
			isNpcOnly: this.isNpcOnly,
		}
	}
}

export const dialogue = <AllowedId extends string>(dialogueId: string) =>
	new DialogueBuilder<AllowedId>(dialogueId)
