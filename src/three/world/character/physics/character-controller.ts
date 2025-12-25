import { useRapier } from '@react-three/rapier'
import { useEffect, useRef, type RefObject } from 'react'

export function useCharacterController(): RefObject<ReturnType<
	ReturnType<typeof useRapier>['world']['createCharacterController']
> | null> {
	const { world } = useRapier()
	const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null)

	useEffect(() => {
		if (!controller.current) {
			controller.current = world.createCharacterController(0.01)
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
