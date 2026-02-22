import type { Bark } from './bark.types'
import type { BarkRepository, DialogueRepository } from './conversation.repository'
import type { DialogueState } from './simple-dialogue.types'

class DialogueStore {
	activeDialogue?: DialogueState

	constructor(public repository?: DialogueRepository<string>) {}

	start(dialogueId: string) {
		const dialogue = this.repository?.(dialogueId)

		if (!dialogue) {
			console.error(`Dialogue with id ${dialogueId} not found.`)
			return
		}

		this.activeDialogue = {
			type: 'dialogue',
			startedAt: Date.now(),
			awaitingChoice: false,
			currentNodeId: dialogue.entryNodeId,
			...dialogue,
		}
	}

	next() {
		if (!this.activeDialogue) return

		const { currentNodeId, nodes } = this.activeDialogue
		const currentNode = nodes[currentNodeId]

		if (!currentNode) {
			console.error(`Current node with id ${currentNodeId} not found.`)
			return
		}

		if (currentNode.nextNodeId) {
			this.activeDialogue.currentNodeId = currentNode.nextNodeId
		} else {
			this.activeDialogue = undefined
		}
	}
}

class BarkStore {
	activeBarks = new Map<string, Bark>()

	constructor(public repository?: BarkRepository) {}

	bark(id: string, duration: number) {
		const bark = this.repository?.get(id)

		if (!bark) {
			console.error(`Bark with id ${id} not found.`)
			return
		}

		this.activeBarks.set(bark.id, bark)

		setTimeout(() => {
			this.activeBarks.delete(bark.id)
		}, duration)
	}
}

export const dialogue = new DialogueStore()
export const barks = new BarkStore()
