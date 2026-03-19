import { useFrame } from '@react-three/fiber'
import { useRef, type PropsWithChildren } from 'react'
import { useSnapshot } from 'valtio'
import type { Character } from '../character/character'
import type { DialogueRepository } from '../conversation'
import { game } from '../game.store'
import { GameLoopContext } from './game-loop.context'
import { GameLoopSystem } from './game-loop.system'

type GameLoopProviderProps = {
	dialogRepository: DialogueRepository<string, Character<string>>
}

export function GameLoopProvider({
	dialogRepository,
	children,
}: PropsWithChildren<GameLoopProviderProps>) {
	const { uiMode } = useSnapshot(game)
	const systemRef = useRef<GameLoopSystem>(null)

	if (!systemRef.current) {
		systemRef.current = new GameLoopSystem(dialogRepository)
	}

	const system = systemRef.current

	useFrame((_, delta) => {
		if (uiMode === 'pause') return
		system.step(delta)
	})

	return <GameLoopContext.Provider value={system}>{children}</GameLoopContext.Provider>
}
