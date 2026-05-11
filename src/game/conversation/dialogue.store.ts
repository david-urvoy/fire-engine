import { proxy } from 'valtio'
import type { NpcDialogue, PlayerDialogue } from './dialogue'

export const dialogueStore = proxy({
	active: undefined as PlayerDialogue | undefined,
	all: [] as NpcDialogue[],
})
