import { type Dexie } from 'dexie'
import { createContext, useContext, type PropsWithChildren, type RefObject } from 'react'

import { DialogueProvider } from './conversation/dialogue/dialogue.context'
import type { EntityManager } from './entity/entity.manager'

interface GameProviderProps {
	entityManager: EntityManager
	canvasRef: RefObject<HTMLCanvasElement | null>
	database: Dexie
}

type GameContextValue = GameProviderProps

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({
	canvasRef,
	entityManager,
	database,
	children,
}: PropsWithChildren<GameProviderProps>) {
	return (
		<GameContext.Provider value={{ canvasRef, entityManager, database }}>
			<DialogueProvider>{children}</DialogueProvider>
		</GameContext.Provider>
	)
}

export function useGame() {
	const context = useContext(GameContext)

	if (!context) throw new Error('useGame must be used within a GameProvider')

	return context as GameProviderProps
}
