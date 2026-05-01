import { createContext, useContext, type PropsWithChildren, type RefObject } from 'react'
import type { CharacterRepository } from './character'
import type { DialogueRepository } from './conversation/types/dialogue.repository'

interface GameProviderProps<CharacterId extends string, DialogueId extends string> {
	characterRepository: CharacterRepository<CharacterId, DialogueId>
	dialogueRepository: DialogueRepository<DialogueId>
	canvasRef: RefObject<HTMLCanvasElement | null>
}

type GameContextValue = GameProviderProps<string, string>

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider<CharacterId extends string, DialogueId extends string>({
	characterRepository,
	dialogueRepository,
	canvasRef,
	children,
}: PropsWithChildren<GameProviderProps<CharacterId, DialogueId>>) {
	return (
		<GameContext.Provider value={{ characterRepository, dialogueRepository, canvasRef }}>
			{children}
		</GameContext.Provider>
	)
}

export function useGame<CharacterId extends string = string, DialogueId extends string = string>() {
	const context = useContext(GameContext)

	if (!context) {
		throw new Error('useGame must be used within a GameProvider')
	}

	return context as GameProviderProps<CharacterId, DialogueId>
}
