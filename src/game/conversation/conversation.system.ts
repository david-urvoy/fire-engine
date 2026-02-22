import type { DialogueState } from './simple-dialogue.types'

export const DialogueSystem = {
	dialogues: new Set<DialogueState>(),

	step(delta: number) {
		this.dialogues.forEach((dialogue) => {
			if (dialogue.awaitingChoice) return
			dialogue.timer = (dialogue.timer || 0) + delta
			const node = dialogue.nodes[dialogue.currentNodeId]

			if (dialogue.timer >= 2) {
				dialogue.timer = 0
				const next = node?.nextNodeId
				if (next) {
					dialogue.currentNodeId = next
					dialogue.currentLineIndex = 0
					dialogue.awaitingChoice = !!node.choices?.length
				} else {
					this.dialogues.delete(dialogue)
				}
			}
		})
	},

	register(dialogue: DialogueState) {
		this.dialogues.add(dialogue)
	},

	unregister(dialogue: DialogueState) {
		this.dialogues.delete(dialogue)
	},
}
