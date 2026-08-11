import { type Dexie } from 'dexie'
import { createContext, useContext, type PropsWithChildren, type RefObject } from 'react'

import type { CharacterManager } from './character'
import type { DialogueManager } from './conversation/dialogue/dialogue.manager'
import type { EntityManager } from './entity/entity.manager'

interface GameProviderProps<CharacterId extends string, DialogueId extends string> {
	entityManager: EntityManager
	characterManager: CharacterManager<CharacterId, DialogueId>
	dialogueManager: DialogueManager<DialogueId>
	canvasRef: RefObject<HTMLCanvasElement | null>
	database: Dexie
}

type GameContextValue = GameProviderProps<string, string>

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider<CharacterId extends string, DialogueId extends string>({
	canvasRef,
	entityManager,
	characterManager,
	dialogueManager,
	database,
	children,
}: PropsWithChildren<GameProviderProps<CharacterId, DialogueId>>) {
	return (
		<GameContext.Provider
			value={{ canvasRef, entityManager, characterManager, dialogueManager, database }}
		>
			{children}
		</GameContext.Provider>
	)
}

export function useGame<CharacterId extends string = string, DialogueId extends string = string>() {
	const context = useContext(GameContext)

	if (!context) throw new Error('useGame must be used within a GameProvider')

	return context as GameProviderProps<CharacterId, DialogueId>
}
