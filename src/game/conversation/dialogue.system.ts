import { game } from '../game.store'
import { AbstractDialogue } from './dialogue'
import type { DialogueRepository } from './types/dialogue.repository'

export class DialogueSystem<DialogueId extends string = string> {
	constructor(private repository: DialogueRepository<DialogueId>) {
		this.repository = repository
	}

	private next({ dialogue, delta }: { dialogue: AbstractDialogue; delta: number }) {
		dialogue.timer = (dialogue.timer || 0) + delta

		if (dialogue.timer >= 10) {
			dialogue.timer = 0
			dialogue.next()
		}
	}

	step(delta: number) {
		game.dialogue.all.forEach((dialogue) => this.next({ dialogue, delta }))
		if (game.dialogue.active) this.next({ dialogue: game.dialogue.active, delta })
	}

	register(dialogueId: DialogueId) {
		const dialogue = this.repository.createNpcDialogue(dialogueId)
		if (!dialogue) {
			console.warn(`Dialogue with ID ${dialogueId} not found.`)
			return
		}

		if (game.dialogue.all.includes(dialogue)) return
		game.dialogue.all.push(dialogue)
	}

	registerActive(dialogueId: DialogueId) {
		const dialogue = this.repository.createPlayerDialogue(dialogueId)
		if (!dialogue) {
			console.warn(`Dialogue with ID ${dialogueId} not found.`)
			return
		}
		game.dialogue.active = dialogue
	}
}
