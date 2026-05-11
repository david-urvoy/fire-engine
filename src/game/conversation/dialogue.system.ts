import { AbstractDialogue } from './dialogue'
import { dialogueStore } from './dialogue.store'

export class DialogueSystem {
	private _step({ dialogue, delta }: { dialogue: AbstractDialogue; delta: number }) {
		dialogue.timer = (dialogue.timer || 0) + delta

		if (dialogue.timer >= 10) {
			dialogue.timer = 0
			dialogue.next()
		}
	}

	step(delta: number) {
		dialogueStore.all.forEach((dialogue) => this._step({ dialogue, delta }))
		if (dialogueStore.active) this._step({ dialogue: dialogueStore.active, delta })
	}
}
