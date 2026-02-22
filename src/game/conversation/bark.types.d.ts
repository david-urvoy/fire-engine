import type { ConversationBase } from './conversation.types'

type Bark = ConversationBase & {
	type: 'bark'
	text: string
}

type BarkState = Bark & {
	startedAt: number
	duration: number
}
