import { type Dexie } from 'dexie'
import { createContext, useContext, type PropsWithChildren, type ReactNode } from 'react'

import { AudioControls } from '../audio/audio-controls'
import { NarrativeProvider } from '../ui'
import { DialogueProvider } from './conversation/dialogue/dialogue.context'
import type { EntityManager } from './entity/entity.manager'

export interface GameProviderProps {
	entityManager: EntityManager
	database: Dexie
}

const GameContext = createContext<GameProviderProps | null>(null)

export function GameProvider({
	entityManager,
	database,
	narrativeIntro,
	children,
}: PropsWithChildren<GameProviderProps> & { narrativeIntro?: ReactNode }) {
	return (
		<GameContext.Provider value={{ entityManager, database }}>
			<NarrativeProvider intro={narrativeIntro}>
				<DialogueProvider>{children}</DialogueProvider>
			</NarrativeProvider>
			<AudioControls />
		</GameContext.Provider>
	)
}

export function useGame() {
	const context = useContext(GameContext)

	if (!context) throw new Error('useGame must be used within a GameProvider')

	return context as GameProviderProps
}
