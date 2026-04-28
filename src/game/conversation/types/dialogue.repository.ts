import type { Character } from '../../character/types/character'
import { game } from '../../game.store'
import { NpcDialogue, PlayerDialogue } from '../dialogue'
import type { DialogueDefinition } from './dialogue'

type Dialogue<DialogueId extends string> = DialogueDefinition<Character<string>['id'], DialogueId>

export interface DialogueRepository<DialogueId extends string = string> {
	get(id: DialogueId): NpcDialogue | PlayerDialogue | undefined
	has(id: DialogueId): boolean
	all(): Array<DialogueDefinition<string, DialogueId>>
	trigger(id: DialogueId): void
}

export function createDialogueRepository<DialogueId extends string>(
	source: Readonly<Record<DialogueId, Dialogue<DialogueId>>>,
): DialogueRepository<DialogueId> {
	function createNpcDialogue(dialogue: Dialogue<DialogueId>) {
		const currentNpcDialogue = game.dialogue.all.find(({ id }) => dialogue.id === id)
		if (currentNpcDialogue) return currentNpcDialogue

		const instance = new NpcDialogue(dialogue)
		game.dialogue.all.push(instance)
		return instance
	}

	function createPlayerDialogue(dialogue: Dialogue<DialogueId>) {
		if (game.dialogue.active) return game.dialogue.active

		game.dialogue.active = new PlayerDialogue(dialogue)
		return game.dialogue.active
	}

	return {
		get(id) {
			const dialogue =
				game.dialogue.active?.id === id
					? game.dialogue.active
					: game.dialogue.all.find((dialogue) => dialogue?.id === id)
			if (dialogue) return dialogue
			throw new Error(`Dialogue with id "${id}" not found in repository`)
		},
		has(id) {
			return id in source
		},
		all() {
			return Object.values(source)
		},
		trigger(id) {
			const dialogue = source[id]
			if (!dialogue) {
				throw new Error(`Dialogue with id "${id}" not found in repository`)
			}

			if (dialogue.isNpcOnly) createNpcDialogue(dialogue)
			else createPlayerDialogue(dialogue)
		},
	}
}
