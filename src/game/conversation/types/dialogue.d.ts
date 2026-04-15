export type ParticipantRole = 'npc' | 'player'

export interface DialogueLine<Id extends string> {
	speakerId: Id
	text: string
}

export interface DialogueOption {
	label: string
	nextNodeId: string
}

export interface DialogueNode<Id extends string> {
	lines: DialogueLine<Id>[]
	choice?: DialogueOption[]
	nextNodeId?: string
}

export interface DialogueParticipant<Id extends string> {
	id: Id
	required?: boolean
}

export interface DialogueDefinition<P extends string, Id extends string = string> {
	id: Id
	participants: readonly DialogueParticipant<P>[]
	isNpcOnly: boolean
	entryNodeId: string
	nodes: Record<string, DialogueNode<P>>
}
