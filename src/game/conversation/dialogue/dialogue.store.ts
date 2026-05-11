import { proxy } from 'valtio'
import type { NpcDialogue, PlayerDialogue } from './dialogue.model'

export const dialogueStore = proxy({
	active: undefined as PlayerDialogue | undefined,
	all: [] as NpcDialogue[],
})
