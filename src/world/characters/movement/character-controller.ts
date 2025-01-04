import { type RapierContext, useRapier } from '@react-three/rapier'
import { type MutableRefObject, useRef } from 'react'

export function useCharacterController(): MutableRefObject<
	ReturnType<RapierContext['world']['createCharacterController']>
>['current'] {
	const { world } = useRapier()
	const controller = useRef<ReturnType<RapierContext['world']['createCharacterController']>>(
		world.createCharacterController(0.2),
	)

	controller.current.setMaxSlopeClimbAngle((80 * Math.PI) / 180)
	controller.current.setMinSlopeSlideAngle((80 * Math.PI) / 180)
	controller.current.enableSnapToGround(1)
	controller.current.setApplyImpulsesToDynamicBodies(true)

	return controller.current
}
