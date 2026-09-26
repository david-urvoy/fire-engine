import { type Dexie } from 'dexie'
import { createContext, useContext, type PropsWithChildren } from 'react'

import { DialogueProvider } from './conversation/dialogue/dialogue.context'
import type { EntityManager } from './entity/entity.manager'

export interface GameProviderProps {
	entityManager: EntityManager
	database: Dexie
}

type GameContextValue = GameProviderProps

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({
	entityManager,
	database,
	children,
}: PropsWithChildren<GameProviderProps>) {
	return (
		<GameContext.Provider value={{ entityManager, database }}>
			<DialogueProvider>{children}</DialogueProvider>
		</GameContext.Provider>
	)
}

export function useGame() {
	const context = useContext(GameContext)

	if (!context) throw new Error('useGame must be used within a GameProvider')

	return context as GameProviderProps
}
