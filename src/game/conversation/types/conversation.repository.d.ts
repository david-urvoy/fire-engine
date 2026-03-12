import type { Bark } from './bark'
import type { GroupDialogue } from './group-dialogue.types'
import type { SimpleDialogue } from './simple-dialogue.types'

export type DialogueRepository<DialogueId extends string, C extends Character<string>> = (
	id: DialogueId,
) => SimpleDialogue<C> | GroupDialogue<C>

export interface BarkRepository {
	get(id: string): Bark
}
