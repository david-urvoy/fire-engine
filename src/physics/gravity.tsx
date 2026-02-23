import { useEffect } from 'react'
import { useEntity, useGameLoopSystem } from '../game'

export function Gravity() {
	const { entity } = useEntity()
	const { gravity } = useGameLoopSystem()

	useEffect(() => {
		gravity.register(entity)
		return () => {
			gravity.unregister(entity)
		}
	}, [gravity, entity])

	return null
}
