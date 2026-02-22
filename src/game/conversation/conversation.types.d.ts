import type { MultiDialogue } from './multi-dialogue.types'
import type { SimpleDialogue } from './simple-dialogue.types'

interface ConversationBase<C extends Character<string>> {
	id: string
	speakerId?: C['id']
}

export type Dialogue<C extends Character<string>> = SimpleDialogue<C> | MultiDialogue<C>
