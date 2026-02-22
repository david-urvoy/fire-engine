type ParticipantRole = 'npc' | 'player'

interface DialogueParticipant<Id extends string> {
	id: Id
	role: ParticipantRole
	required?: boolean
}

interface MultiDialogueNode<Id extends string> {
	lines: {
		speakerId: Id
		text: string
	}[]
	choices?: DialogueChoice[]
	nextNodeId?: string
}

export interface MultiDialogue<C extends Character<string>, P extends C['id'] = C['id']> {
	id: string
	kind: 'multi'
	participants: readonly DialogueParticipant<P>[]
	entryNodeId: string
	nodes: Record<string, MultiDialogueNode<P>>
}
