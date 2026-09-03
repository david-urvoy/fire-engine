import { proxy } from 'valtio'

import type { CharacterType } from '../../character'
import type { Bark } from './bark'
import type { BarkManager } from './bark.manager'

type ActiveBark = Bark<CharacterType<string>> & {
	startedAt: number
	duration: number
}

let manager: BarkManager | undefined

export const barkStore = proxy({
	active: [] as ActiveBark[],
	setManager(nextManager?: BarkManager) {
		manager = nextManager
	},
	bark(id: string, duration: number) {
		const bark = manager?.get(id)

		if (!bark) {
			console.error(`Bark with id ${id} not found.`)
			return
		}

		const barkState: ActiveBark = {
			...bark,
			startedAt: Temporal.Now.instant().epochMilliseconds,
			duration,
		}

		const existingIndex = barkStore.active.findIndex((activeBark) => activeBark.id === bark.id)
		if (existingIndex !== -1) barkStore.active.splice(existingIndex, 1)

		barkStore.active.push(barkState)

		setTimeout(() => {
			const index = barkStore.active.findIndex((activeBark) => activeBark.id === bark.id)
			if (index !== -1) barkStore.active.splice(index, 1)
		}, duration)
	},
})
