export type DialogueEvents = {
	dialogue_started: { dialogueId: string }
	dialogue_ended: { dialogueId: string }
	dialogue_node_ended: { dialogueId: string; nodeId: string }
	choice_selected: { dialogueId: string; choiceId: string }
}
