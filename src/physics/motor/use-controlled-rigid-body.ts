import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import { useCallback, type RefObject } from 'react'
import { Vector3, type Quaternion } from 'three'

import { useEntity } from '../../game'
import { useCharacterController } from '../character-controller'
import { useTeleport } from './use-teleport'

function useComputedMovement(controllerRef: RefObject<KinematicCharacterController | null>) {
	const { entity } = useEntity()

	return useCallback(() => {
		const body = entity.runtime.rigidBody?.current
		const controller = controllerRef?.current
		if (!body || !entity.physic || !controller) return

		const computedMovement = controller.computedMovement()
		const translation = body.translation()
		translation.x += computedMovement.x
		translation.y += computedMovement.y
		translation.z += computedMovement.z

		if (entity.position.distanceToSquared(translation) > 1e-6)
			body.setNextKinematicTranslation(translation)

		entity.physic.setGrounded(controller.computedGrounded())
	}, [entity.runtime.rigidBody, controllerRef, entity.physic, entity.position])
}

export function useCharacterMovement() {
	const characterController = useCharacterController()
	const { entity } = useEntity()
	const applyTeleport = useTeleport()
	const applyComputedMovement = useComputedMovement(characterController)

	return useCallback(
		(translation: Vector3, rotation: Quaternion) => {
			applyTeleport()

			const body = entity.runtime.rigidBody?.current
			const controller = characterController?.current
			if (!body || !controller) return

			controller.computeColliderMovement(body.collider(0), translation)

			body.setNextKinematicRotation(rotation)
			applyComputedMovement()
		},
		[entity, characterController, applyTeleport, applyComputedMovement],
	)
}
