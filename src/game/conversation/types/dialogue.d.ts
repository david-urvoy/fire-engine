import type { Character } from '../../character/character'

type ParticipantRole = 'npc' | 'player'

interface DialogueLine<C extends Character<string>> {
	speakerId: C
	text: string
}

export interface DialogueChoice {
	label: string
	nextNodeId: string
}

interface DialogueNode<Id extends string> {
	lines: {
		speakerId: Id
		text: string
	}[]
	choices?: DialogueChoice[]
	nextNodeId?: string
}

interface DialogueParticipant<Id extends string> {
	id: Id
	role: ParticipantRole
	required?: boolean
}

interface SimpleDialogueNode {
	lines: string[]
	choices?: DialogueChoice[]
	nextNodeId?: string
}

interface SimpleDialogue<C extends Character<string>, P extends C['id'] = C['id']> {
	id: string
	kind: 'simple'
	speakerId: C['id']
	entryNodeId: string
	nodes: Record<string, SimpleDialogueNode>
}

export interface GroupDialogue<C extends Character<string>, P extends C['id'] = C['id']> {
	id: string
	kind: 'multi'
	participants: readonly DialogueParticipant<P>[]
	entryNodeId: string
	nodes: Record<string, DialogueNode<P>>
}
