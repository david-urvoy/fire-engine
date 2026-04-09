import { proxy } from 'valtio'
import type { CharacterApi } from './types/character'

export const CharacterStore = proxy({
	characters: {} as Record<string, CharacterApi>,
})
