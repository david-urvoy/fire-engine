import type { Character } from '../../character/types/character'
import type { DialogueDefinition, DialogueNode } from '../dialogue/dialogue'

class DialogueBuilder<
	CharacterId extends string,
	DialogueId extends string,
	ParticipantId extends CharacterId = CharacterId,
> {
	private nodes: Record<string, DialogueNode<ParticipantId>> = {}
	private entryNodeId = ''
	private requiredParticipants: ParticipantId[] = []
	private optionalParticipants: ParticipantId[] = []
	private isNpcOnly = false
	private isLocked = false

	constructor(private readonly dialogueId: DialogueId) {}

	withParticipants<
		RequiredIds extends readonly ParticipantId[],
		OptionalIds extends readonly ParticipantId[] = readonly [],
	>(
		requiredIds: RequiredIds,
		optionalIds: OptionalIds = [] as any,
	): DialogueBuilder<CharacterId, DialogueId, RequiredIds[number] | OptionalIds[number]> {
		this.requiredParticipants.push(...requiredIds)
		this.optionalParticipants.push(...optionalIds)
		return this
	}

	npcOnly() {
		this.isNpcOnly = true
		return this
	}

	locked() {
		this.isLocked = true

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

	private hasReachableChoice() {
		const visited = new Set<string>()
		const toVisit = [this.entryNodeId]

		while (toVisit.length) {
			const nodeId = toVisit.pop()
			if (!nodeId || visited.has(nodeId)) continue
			visited.add(nodeId)

			const node = this.nodes[nodeId]
			if (!node) continue

			if (node.choice?.length) return true

			if (node.nextNodeId) toVisit.push(node.nextNodeId)
			for (const choice of node.choice ?? []) {
				toVisit.push(choice.nextNodeId)
			}
		}

		return false
	}

	done(): DialogueDefinition<Character<ParticipantId>['id'], DialogueId> {
		if (!this.entryNodeId) {
			throw new Error('A dialogue must define at least one node before done().')
		}

		const hasChoice = this.hasReachableChoice()

		if (this.isNpcOnly && hasChoice) {
			throw new Error('An npcOnly dialogue cannot contain reachable choices.')
		}

		if (this.isNpcOnly)
			return {
				id: this.dialogueId,
				participants: [
					...this.requiredParticipants.map((id) => ({ id, required: true })),
					...this.optionalParticipants.map((id) => ({ id, required: false })),
				],
				entryNodeId: this.entryNodeId,
				nodes: this.nodes,
				isNpcOnly: true,
			}

		return {
			id: this.dialogueId,
			participants: [
				...this.requiredParticipants.map((id) => ({ id, required: true })),
				...this.optionalParticipants.map((id) => ({ id, required: false })),
			],
			entryNodeId: this.entryNodeId,
			nodes: this.nodes,
			isNpcOnly: false,
			locked: this.isLocked || hasChoice,
		}
	}
}

export const dialogue = <AllowedId extends string, Id extends string = string>(dialogueId: Id) =>
	new DialogueBuilder<AllowedId, Id>(dialogueId)

export const dialogueFor =
	<AllowedId extends string>() =>
	<Id extends string>(dialogueId: Id) =>
		new DialogueBuilder<AllowedId, Id>(dialogueId)
