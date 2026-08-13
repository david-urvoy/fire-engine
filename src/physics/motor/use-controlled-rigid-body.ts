import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import { useCallback, useRef, type RefObject } from 'react'
import { Vector3 } from 'three'

import { useEntity } from '../../game'
import { useCharacterController } from '../character-controller'
import { useTeleport } from './use-teleport'

function useComputedMovement(controllerRef: RefObject<KinematicCharacterController | null>) {
	const { entity } = useEntity()
	const tmpDesired = useRef(new Vector3())

	return useCallback(() => {
		const body = entity.runtime.rigidBody?.current
		const controller = controllerRef?.current

		if (!body || !entity.physic || !controller) return

		const desired = tmpDesired.current
		desired.copy(body.translation()).add(controller.computedMovement())

		if (desired.distanceToSquared(entity.position) > 1e-6) {
			body.setNextKinematicTranslation(desired)
			entity.position.copy(desired)
		}

		entity.physic.isGrounded = controller.computedGrounded()
	}, [controllerRef, entity])
}

export function useCharacterMovement() {
	const characterController = useCharacterController()
	const { entity } = useEntity()
	const applyTeleport = useTeleport()
	const applyComputedMovement = useComputedMovement(characterController)

	return useCallback(
		(delta: Vector3) => {
			applyTeleport()

			const body = entity.runtime.rigidBody?.current
			const controller = characterController?.current
			if (!body || !controller) return

			body.setNextKinematicRotation(entity.orientation)

			controller.computeColliderMovement(body.collider(0), delta)
			applyComputedMovement()
		},
		[entity, characterController, applyTeleport, applyComputedMovement],
	)
}
