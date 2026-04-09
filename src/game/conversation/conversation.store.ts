import type { Character } from '../character/types/character'
import { NpcDialogue, PlayerDialogue } from './dialogue'
import type { Bark } from './types/bark'
import type { BarkRepository, DialogueRepository } from './types/conversation.repository'

export const dialogueStore = {
	active: undefined as PlayerDialogue | undefined,
	all: [] as NpcDialogue[],
	repository: undefined as unknown as DialogueRepository<string, Character<string>>,

	register(dialogueId: string) {
		const dialogue = this.repository(dialogueId)
		if (!dialogue) {
			console.warn(`Dialogue with ID ${dialogueId} not found.`)
			return
		}
		this.all.push(new NpcDialogue(dialogue))
	},

	registerActive(dialogueId: string) {
		const dialogue = this.repository(dialogueId)
		if (!dialogue) {
			console.warn(`Dialogue with ID ${dialogueId} not found.`)
			return
		}
		this.active = new PlayerDialogue(dialogue)
	},
}

class BarkStore {
	activeBarks = new Map<string, Bark<Character<string>>>()

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

export const barks = new BarkStore()
