import { createContext, useContext, type PropsWithChildren } from 'react'

type CharacterContextType = {
	id: string
}

const CharacterContext = createContext<CharacterContextType | null>(null)

export function CharacterProvider({
	id,
	children,
}: PropsWithChildren<{
	id: string
}>) {
	return <CharacterContext.Provider value={{ id }}>{children}</CharacterContext.Provider>
}

export function useCharacter() {
	const context = useContext(CharacterContext)

	if (!context) {
		throw new Error('useCharacter must be used within a CharacterProvider')
	}

	return context
}
