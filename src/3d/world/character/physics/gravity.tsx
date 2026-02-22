import { useEffect } from 'react'
import { useEntity } from '../../../../game'
import { GameLoopSystem } from '../../../../game/game-loop.system'

export function Gravity() {
	const { entity } = useEntity()

	useEffect(() => {
		GameLoopSystem.systems.gravity.register(entity)
		return () => {
			GameLoopSystem.systems.gravity.unregister(entity)
		}
	}, [entity])

	return null
}
