import { useEffect } from 'react'
import { GameLoopSystem, useEntity } from '../game'

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
