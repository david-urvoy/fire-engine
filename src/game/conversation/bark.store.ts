import type { Bark, BarkManager } from '../..'
import type { Character } from '../character'

class BarkStore {
	activeBarks = new Map<string, Bark<Character<string>>>()

	constructor(public manager?: BarkManager) {}

	bark(id: string, duration: number) {
		const bark = this.manager?.get(id)

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

export const barkStore = new BarkStore()
