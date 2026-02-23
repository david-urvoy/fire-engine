import { createContext, useContext } from 'react'
import type { GameLoopSystem } from './game-loop.system'

export const GameLoopContext = createContext<GameLoopSystem | null>(null)

export function useGameLoopSystem() {
	const context = useContext(GameLoopContext)

	if (!context) {
		throw new Error('GameLoopSystem not found in React tree')
	}

	return context
}
