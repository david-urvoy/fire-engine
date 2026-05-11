import type { DialogueManager } from '../conversation/dialogue/dialogue.manager'
import { Character } from './character.model'
import type { CharacterApi, Character as CharacterData } from './types/character'

export interface CharacterManager<
	CharacterId extends string = string,
	DialogueId extends string = string,
> {
	get(id: CharacterId): CharacterApi<CharacterId, DialogueId>
	create(id: CharacterId): CharacterApi<CharacterId, DialogueId>
	has(id: CharacterId): boolean
	all(): Array<CharacterApi<string, string>>
}

export function createCharacterManager<
	const Source extends Readonly<Record<string, CharacterData<string>>>,
>(
	source: Source,
	dialogueManager: DialogueManager<string>,
): CharacterManager<Extract<keyof Source, string>> {
	type CharacterId = Extract<keyof Source, string>
	const instances = new Map<CharacterId, Character>()

	return {
		get(id) {
			const instance = instances.get(id)
			if (instance) return instance
			throw new Error(`Character "${id}" not found in repository`)
		},
		create(id) {
			if (instances.has(id)) return instances.get(id)!

			const data = source[id]
			if (!data) throw new Error(`Character "${id}" not found in repository`)

			const instance = new Character({ ...data }, dialogueManager)
			instances.set(id, instance)
			return instance
		},
		has(id) {
			return id in source
		},
		all() {
			return Array.from(instances.values())
		},
	}
}
