import { useFrame } from '@react-three/fiber'
import { createContext, useContext, useRef, type PropsWithChildren } from 'react'
import { useSnapshot } from 'valtio'
import { GameLoopContext, GameLoopSystem } from './game'
import type { CharacterRepository } from './game/character/character.repository'
import { type DialogueRepository } from './game/conversation'
import { game } from './game/game.store'

interface GameProviderProps<CharacterId extends string, DialogueId extends string> {
	characterRepository: CharacterRepository<CharacterId, DialogueId>
	dialogueRepository: DialogueRepository<DialogueId>
}

type GameContextValue = GameProviderProps<string, string>

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider<CharacterId extends string, DialogueId extends string>({
	characterRepository,
	dialogueRepository,
	children,
}: PropsWithChildren<GameProviderProps<CharacterId, DialogueId>>) {
	const { uiMode } = useSnapshot(game)
	const systemRef = useRef<GameLoopSystem>(null)

	if (!systemRef.current) {
		systemRef.current = new GameLoopSystem(dialogueRepository)
	}

	const system = systemRef.current

	useFrame((_, delta) => {
		if (uiMode === 'pause') return
		system.step(delta)
	})

	return (
		<GameContext.Provider value={{ characterRepository, dialogueRepository }}>
			<GameLoopContext.Provider value={system}>{children}</GameLoopContext.Provider>
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
