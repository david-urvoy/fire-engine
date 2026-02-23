import type { DialogueRepository } from './conversation.repository'
import type { DialogueState } from './simple-dialogue.types'

export class DialogueSystem {
	private dialogues = new Set<DialogueState>()
	private repository: DialogueRepository<string>

	constructor(repository: DialogueRepository<string>) {
		this.repository = repository
	}

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
	}

	register(dialogueId: string) {
		this.dialogues.add(this.repository(dialogueId))
	}

	unregister(dialogue: DialogueState) {
		this.dialogues.delete(dialogue)
	}
}
