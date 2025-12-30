import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import { useRapier } from '@react-three/rapier'
import { useEffect, useRef, type RefObject } from 'react'

export function useCharacterController(): RefObject<KinematicCharacterController | null> {
	const { world } = useRapier()
	const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null)

	useEffect(() => {
		if (!controller.current) {
			controller.current = world.createCharacterController(0.1)
			controller.current.setMaxSlopeClimbAngle((60 * Math.PI) / 180)
			controller.current.setMinSlopeSlideAngle((40 * Math.PI) / 180)
			controller.current.enableSnapToGround(0.2)
			controller.current.setApplyImpulsesToDynamicBodies(true)
		}

		return () => {
			if (controller.current) {
				world.removeCharacterController(controller.current)
				controller.current = null
			}
		}
	}, [world])

	return controller
}
