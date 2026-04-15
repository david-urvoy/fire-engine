import { proxy } from 'valtio'
import { NpcDialogue, PlayerDialogue } from './dialogue'

export const dialogueStore = proxy({
	active: undefined as PlayerDialogue | undefined,
	all: [] as NpcDialogue[],
})
