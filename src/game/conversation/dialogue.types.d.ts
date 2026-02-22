interface DialogueLine<C extends Character<string>> {
	speakerId: C
	text: string
}

interface DialogueChoice {
	label: string
	nextNodeId: string
}
