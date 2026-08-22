import { createContext, useContext, type PropsWithChildren } from 'react'

import type { Character } from './character.model'

type CharacterContextType = {
	character: Character
}

const CharacterContext = createContext<CharacterContextType | null>(null)

export function CharacterProvider({
	character,
	children,
}: PropsWithChildren<CharacterContextType>) {
	return <CharacterContext.Provider value={{ character }}>{children}</CharacterContext.Provider>
}

export function useCharacter() {
	const context = useContext(CharacterContext)

	if (!context) {
		throw new Error('useCharacter must be used within a CharacterProvider')
	}

	return context
}
