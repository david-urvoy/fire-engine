import type { Character } from '../../character/types/character'

export type Bark<C extends Character<string>> = {
	id: string
	speakerId?: C['id']
	type: 'bark'
	text: string
}

type BarkState = Bark & {
	startedAt: number
	duration: number
}
