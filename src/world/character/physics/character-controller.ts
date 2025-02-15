import { useRapier } from '@react-three/rapier'
import { useEffect, useRef } from 'react'

export function useCharacterController() {
	const { world } = useRapier()
	const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null)

	useEffect(() => {
		if (!controller.current) {
			controller.current = world.createCharacterController(0.2)
			controller.current.setMaxSlopeClimbAngle((80 * Math.PI) / 180)
			controller.current.setMinSlopeSlideAngle((80 * Math.PI) / 180)
			controller.current.enableSnapToGround(1)
			controller.current.setApplyImpulsesToDynamicBodies(true)
		}

		return () => {
			controller.current = null
		}
	}, [world])

	return controller
}
