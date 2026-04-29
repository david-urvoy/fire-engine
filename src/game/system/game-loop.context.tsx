import { useFrame } from '@react-three/fiber'
import { createContext, useContext, useRef, type PropsWithChildren } from 'react'
import { useSnapshot } from 'valtio'
import { useGame } from '../game.context'
import { game } from '../game.store'
import { GameLoopSystem } from './game-loop.system'

const GameLoopContext = createContext<GameLoopSystem | null>(null)

export function GameLoopProvider({ children }: PropsWithChildren) {
	const { dialogueSystem } = useGame()
	const { uiMode } = useSnapshot(game)
	const systemRef = useRef<GameLoopSystem>(null)

	if (!systemRef.current) {
		systemRef.current = new GameLoopSystem(dialogueSystem)
	}

	const system = systemRef.current

	useFrame((_, delta) => {
		if (uiMode === 'pause') return
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
