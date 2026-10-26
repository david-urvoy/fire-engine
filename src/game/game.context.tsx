import { type Dexie } from 'dexie'
import { createContext, useContext, type PropsWithChildren } from 'react'

import { AudioControls } from '../audio/audio-controls'
import { DialogueProvider } from './conversation/dialogue/dialogue.context'
import type { EntityManager } from './entity/entity.manager'
import { QuestsProvider } from './quest'

export interface GameProviderProps {
	entityManager: EntityManager
	database: Dexie
}

const GameContext = createContext<GameProviderProps | null>(null)

export function GameProvider({
	entityManager,
	database,
	children,
}: PropsWithChildren<GameProviderProps>) {
	return (
		<GameContext.Provider value={{ entityManager, database }}>
			<QuestsProvider>
				<DialogueProvider>{children}</DialogueProvider>
			</QuestsProvider>
			<AudioControls />
		</GameContext.Provider>
	)
}

export function useGame() {
	const context = useContext(GameContext)

	if (!context) throw new Error('useGame must be used within a GameProvider')

	return context as GameProviderProps
}
