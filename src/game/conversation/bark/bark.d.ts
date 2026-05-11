import type { Character } from '../../character/types/character'

export type Bark<C extends Character<string>> = {
	id: string
	speakerId?: C['id']
	type: 'bark'
	text: string
}

type BarkState<C extends Character<string>> = Bark<C> & {
	startedAt: number
	duration: number
}
