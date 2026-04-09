import type { Character } from '../../character/types/character'

export type ParticipantRole = 'npc' | 'player'

export type DialogueId = string

export interface DialogueLine<C extends Character<string>> {
	speakerId: C
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

export interface DialogueDefinition<C extends Character<string>, P extends C['id'] = C['id']> {
	id: DialogueId
	participants: readonly DialogueParticipant<P>[]
	isNpcOnly: boolean
	entryNodeId: string
	nodes: Record<string, DialogueNode<P>>
}
