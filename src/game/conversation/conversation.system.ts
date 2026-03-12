import type { Character } from '../character/character'
import { game } from '../game.store'
import { AbstractDialogue, NpcDialogue, PlayerDialogue } from './dialogue'
import type { DialogueRepository } from './types/conversation.repository'

export class DialogueSystem {
	constructor(private repository: DialogueRepository<string, Character<string>>) {
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

	register(dialogueId: string) {
		game.dialogue.all.push(new NpcDialogue(this.repository(dialogueId)))
	}

	registerActive(dialogueId: string) {
		game.dialogue.active = new PlayerDialogue(this.repository(dialogueId))
	}
}
