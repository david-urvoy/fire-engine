export type { Bark as BarkType } from './bark/bark'
export type { DialogueDefinition as Dialogue } from './dialogue/dialogue'

export type { BarkManager } from './bark/bark.manager'
export { createDialogueManager } from './dialogue/dialogue.manager'
export * from './dsl/dialogue.dsl'

export * from './bark/bark.store'
export * from './compiler/dialogues.compiler'
export * from './dialogue/dialogue.store'
