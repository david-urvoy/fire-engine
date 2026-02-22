import type { Bark } from './bark.types'
import type { Dialogue } from './simple-dialogue.types'

export type DialogueRepository<DialogueId extends string> = (id: DialogueId) => Dialogue

export interface BarkRepository {
	get(id: string): Bark
}
