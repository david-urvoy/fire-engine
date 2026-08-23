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
	choice?: {
		options: DialogueOption[]
		type?: 'fixed' | 'extensible'
	}
	nextNodeId?: string
}

export interface DialogueParticipant<Id extends string> {
	id: Id
	required?: boolean
}

export type DialogueDefinition<P extends string, Id extends string = string> = {
	id: Id
	participants: readonly DialogueParticipant<P>[]
} & ({
	entryNodeId: string
	nodes: Record<string, DialogueNode<P>>
} & (
	| {
			isNpcOnly: true
			locked?: never
	  }
	| {
			isNpcOnly: boolean
			locked?: boolean
	  }
))

export interface QuestDialogueDefinition<P extends string> {
	option: {
		speakerId: P
		label: string
		nextNodeId: string
	}
	nodes: Record<string, DialogueNode<P>>
}
