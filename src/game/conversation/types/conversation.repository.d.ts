import type { Bark } from './bark'
import type { DialogueDefinition } from './dialogue'

export type DialogueRepository<DialogueId extends string, C extends Character<string>> = (
	id: DialogueId,
) => DialogueDefinition

export interface BarkRepository {
	get(id: string): Bark
}
