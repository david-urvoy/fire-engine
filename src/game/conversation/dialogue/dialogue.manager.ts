import type { DialogueDefinition } from '../dsl/dialogue-definition.type'
import { NpcDialogue, PlayerDialogue } from './dialogue.model'

export interface DialogueManager<DialogueId extends string = string> {
	get(id: DialogueId): NpcDialogue | PlayerDialogue
	has(id: DialogueId): boolean
	all(): Array<DialogueDefinition<string, DialogueId>>
	trigger(id: DialogueId): void
}
