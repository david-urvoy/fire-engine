interface SimpleDialogueNode {
	lines: string[]
	choices?: DialogueChoice[]
	nextNodeId?: string
}

export interface SimpleDialogue<C extends Character<string>, P extends C['id'] = C['id']> {
	id: string
	kind: 'simple'
	speakerId: C['id']
	entryNodeId: string
	nodes: Record<string, SimpleDialogueNode>
}

interface DialogueState extends SimpleDialogue<string, string> {
	type: 'dialogue'
	currentNodeId: string
	awaitingChoice: boolean
	startedAt: number
	timer?: number
	currentLineIndex?: number
}
