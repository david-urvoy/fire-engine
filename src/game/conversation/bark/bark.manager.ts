import type { Character } from '../../character/character.types'
import type { Bark } from './bark'

export interface BarkManager<C extends Character<string> = Character<string>> {
	get(id: string): Bark<C> | undefined
}
