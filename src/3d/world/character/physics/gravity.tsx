import { useEffect } from 'react'
import { game, useEntity } from '../../../../game'
import { GameLoopSystem } from '../../../../game/entity/game-loop.system'

export function Gravity() {
	const { id } = useEntity()
	const entity = game.entities[id]

	if (!entity) throw new Error(`Entity "${id}" not found`)

	useEffect(() => {
		GameLoopSystem.systems.gravity.register(entity)
		return () => {
			GameLoopSystem.systems.gravity.unregister(entity)
		}
	}, [entity])

	return null
}
