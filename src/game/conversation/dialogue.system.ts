import { game } from '../game.store'
import { AbstractDialogue } from './dialogue'
import type { DialogueRepository } from './types/dialogue.repository'

export class DialogueSystem<DialogueId extends string = string> {
	constructor(private repository: DialogueRepository<DialogueId>) {
		this.repository = repository
	}

	private _step({ dialogue, delta }: { dialogue: AbstractDialogue; delta: number }) {
		dialogue.timer = (dialogue.timer || 0) + delta

		if (dialogue.timer >= 10) {
			dialogue.timer = 0
			dialogue.next()
		}
	}

	step(delta: number) {
		game.dialogue.all.forEach((dialogue) => this._step({ dialogue, delta }))
		if (game.dialogue.active) this._step({ dialogue: game.dialogue.active, delta })
	}

	trigger(dialogueId: DialogueId) {
		return this.repository.trigger(dialogueId)
	}
}
