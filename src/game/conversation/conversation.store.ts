import type { Character } from '../character/character'
import type { NpcDialogue, PlayerDialogue } from './dialogue'
import type { Bark } from './types/bark'
import type { BarkRepository } from './types/conversation.repository'

export const dialogueStore = {
	active: undefined as PlayerDialogue | undefined,
	all: [] as NpcDialogue[],
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
