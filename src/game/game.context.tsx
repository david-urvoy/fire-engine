import { createContext, useContext, type PropsWithChildren, type RefObject } from 'react'
import type { CharacterRepository } from './character'
import type { DialogueSystem } from './conversation/dialogue.system'

interface GameProviderProps<CharacterId extends string, DialogueId extends string> {
	characterRepository: CharacterRepository<CharacterId, DialogueId>
	dialogueSystem: DialogueSystem<DialogueId>
	canvasRef: RefObject<HTMLCanvasElement | null>
}

type GameContextValue = GameProviderProps<string, string>

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider<CharacterId extends string, DialogueId extends string>({
	characterRepository,
	dialogueSystem,
	canvasRef,
	children,
}: PropsWithChildren<GameProviderProps<CharacterId, DialogueId>>) {
	return (
		<GameContext.Provider value={{ characterRepository, dialogueSystem, canvasRef }}>
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
