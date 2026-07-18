import { createContext, useContext, type PropsWithChildren } from 'react'

type CharacterContextType = {
	id: string
	name: string
}

const CharacterContext = createContext<CharacterContextType | null>(null)

export function CharacterProvider({ id, name, children }: PropsWithChildren<CharacterContextType>) {
	return <CharacterContext.Provider value={{ id, name }}>{children}</CharacterContext.Provider>
}

export function useCharacter() {
	const context = useContext(CharacterContext)

	if (!context) {
		throw new Error('useCharacter must be used within a CharacterProvider')
	}

	return context
}
