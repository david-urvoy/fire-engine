import { type Dexie } from 'dexie'
import { createContext, Suspense, useContext, type PropsWithChildren } from 'react'

import { NavigationProvider } from '../ai'
import { DialogueProvider } from './conversation/dialogue/dialogue.context'
import { EntityManager } from './entity/entity.manager'
import { QuestsProvider } from './quest'

export interface GameProviderProps {
	database: Dexie
}

interface GameContextValue extends GameProviderProps {
	entityManager: EntityManager
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ database, children }: PropsWithChildren<GameProviderProps>) {
	return (
		<Suspense fallback="Loading...">
			<GameContext.Provider value={{ entityManager: new EntityManager(), database }}>
				<QuestsProvider>
					<NavigationProvider>
						<DialogueProvider>{children}</DialogueProvider>
					</NavigationProvider>
				</QuestsProvider>
			</GameContext.Provider>
		</Suspense>
	)
}

export function useGame() {
	const context = useContext(GameContext)

	if (!context) throw new Error('useGame must be used within a GameProvider')

	return context as GameContextValue
}
