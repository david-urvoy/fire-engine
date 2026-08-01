import { useFrame } from '@react-three/fiber'
import { createContext, useContext, useMemo, type PropsWithChildren } from 'react'
import { useSnapshot } from 'valtio'

import { game } from '../game.store'
import { GameLoopSystem } from './game-loop.system'

const GameLoopContext = createContext<GameLoopSystem | null>(null)

export function GameLoopProvider({ children }: PropsWithChildren) {
	const { isPaused } = useSnapshot(game)
	const system = useMemo(() => {
		return new GameLoopSystem()
	}, [])

	useFrame((_, delta) => {
		if (isPaused) return
		system.step(delta)
	})

	return <GameLoopContext.Provider value={system}>{children}</GameLoopContext.Provider>
}

export function useGameLoopSystem() {
	const context = useContext(GameLoopContext)

	if (!context) {
		throw new Error('GameLoopSystem not found in React tree')
	}

	return context
}
