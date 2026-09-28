import { type Dexie } from 'dexie'
import { createContext, useContext, type PropsWithChildren } from 'react'

import { MaterialsProvider, type MaterialGroupConfig } from '../3d/material/material.context'
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
	materialsConfig,
	children,
}: PropsWithChildren<
	GameProviderProps & { materialsConfig: Record<string, MaterialGroupConfig> }
>) {
	return (
		<GameContext.Provider value={{ entityManager, database }}>
			<MaterialsProvider materialsConfig={materialsConfig}>
				<DialogueProvider>{children}</DialogueProvider>
			</MaterialsProvider>
		</GameContext.Provider>
	)
}

export function useGame() {
	const context = useContext(GameContext)

	if (!context) throw new Error('useGame must be used within a GameProvider')

	return context as GameProviderProps
}
