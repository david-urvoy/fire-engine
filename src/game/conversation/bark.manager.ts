import type { Character } from '../character/types/character'
import type { Bark } from './types/bark'

export interface BarkManager<C extends Character<string> = Character<string>> {
	get(id: string): Bark<C> | undefined
}
