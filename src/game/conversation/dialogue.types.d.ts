import type { EntityState } from '../entity/entity.types'
import type { ConversationBase } from './conversation.types'

type Dialogue = ConversationBase & {
	id: string
	entryNodeId: string
	nodes: Record<string, DialogueNode>
}

type DialogueLine = {
	speakerId: EntityState['id']
	text: string
}

type DialogueChoice = {
	label: string
	nextNodeId: string
}

type DialogueNode = {
	lines: DialogueLine[]
	choices?: DialogueChoice[]
	nextNodeId?: string
	duration?: number
}

type DialogueState = Dialogue & {
	type: 'dialogue'
	currentNodeId: string
	awaitingChoice: boolean
	startedAt: number
	timer?: number
	currentLineIndex?: number
}
