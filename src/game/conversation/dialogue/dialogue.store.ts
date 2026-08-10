import { proxy } from 'valtio'

import type { NpcDialogue, PlayerDialogue } from './dialogue.model'

export const dialogueStore = proxy<{
	active: PlayerDialogue | undefined
	all: NpcDialogue[]
	isLocked: boolean
}>({
	active: undefined,
	all: [],
	get isLocked() {
		return !!this.active?.locked
	},
})
