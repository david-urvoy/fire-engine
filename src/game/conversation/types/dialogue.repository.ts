import type { Character } from '../../character/types/character'
import { NpcDialogue, PlayerDialogue } from '../dialogue'
import type { DialogueDefinition } from './dialogue'

export interface DialogueRepository<DialogueId extends string = string> {
	get(id: DialogueId): NpcDialogue | PlayerDialogue | undefined
	has(id: DialogueId): boolean
	all(): Array<DialogueDefinition<string, DialogueId>>
	createNpcDialogue(id: DialogueId): NpcDialogue | undefined
	createPlayerDialogue(id: DialogueId): PlayerDialogue | undefined
}

export function createDialogueRepository<DialogueId extends string>(
	source: Readonly<Record<DialogueId, DialogueDefinition<Character<string>['id'], DialogueId>>>,
): DialogueRepository<DialogueId> {
	const npcInstances = new Map<DialogueId, NpcDialogue>()
	let playerInstance: PlayerDialogue | undefined = undefined

	return {
		get(id) {
			const instance = playerInstance?.id === id ? playerInstance : npcInstances.get(id)
			if (instance) return instance
			throw new Error(`Dialogue with id "${id}" not found in repository`)
		},
		has(id) {
			return id in source
		},
		all() {
			return Object.values(source)
		},
		createNpcDialogue(id) {
			if (npcInstances.has(id)) return npcInstances.get(id)

			const dialogue = source[id]
			if (!dialogue) return undefined

			const instance = new NpcDialogue(dialogue)
			npcInstances.set(id, instance)
			return instance
		},
		createPlayerDialogue(id) {
			if (playerInstance) return playerInstance

			const dialogue = source[id]
			if (!dialogue) return undefined

			playerInstance = new PlayerDialogue(dialogue)
			return playerInstance
		},
	}
}
