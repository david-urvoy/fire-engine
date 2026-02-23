import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { useSnapshot } from 'valtio'
import type { DialogueRepository } from '../conversation'
import { game } from '../game.store'
import { GameLoopContext } from './game-loop.context'
import { GameLoopSystem } from './game-loop.system'

type Props = {
	dialogRepository: DialogueRepository<string>
	children: React.ReactNode
}

export function GameLoopProvider({ dialogRepository, children }: Props) {
	const { uiMode } = useSnapshot(game)

	const system = useMemo(() => {
		return new GameLoopSystem(dialogRepository)
	}, [dialogRepository])

	useFrame((_, delta) => {
		if (uiMode === 'pause') return
		system.step(delta)
	})

	return <GameLoopContext.Provider value={system}>{children}</GameLoopContext.Provider>
}
