import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import { useCallback, useRef, type RefObject } from 'react'
import { Vector3 as YukaVector3 } from 'yuka'

import { useEntity } from '../../game'
import { useTeleport } from './use-teleport'

export function useCharacterMovement(
	controllerRef: RefObject<KinematicCharacterController | null>,
) {
	const { entity } = useEntity()
	const applyTeleport = useTeleport()
	const position = useRef(new YukaVector3())

	return useCallback(() => {
		applyTeleport()

		const body = entity.runtime.rigidBody
		const controller = controllerRef?.current
		if (!body || !controller || !entity.physic) return

		controller.computeColliderMovement(body.collider(0), entity.velocity)

		const computedMovement = controller.computedMovement()
		const translation = body.translation()
		position.current.set(
			translation.x + computedMovement.x,
			translation.y + computedMovement.y,
			translation.z + computedMovement.z,
		)

		if (entity.position.squaredDistanceTo(position.current) > 1e-6) {
			entity.position.copy(position.current)
			body.setNextKinematicTranslation(entity.position)
		}
		body.setNextKinematicRotation(entity.rotation)
		entity.physic.setGrounded(controller.computedGrounded())
	}, [
		entity.runtime.rigidBody,
		controllerRef,
		applyTeleport,
		entity.physic,
		entity.position,
		entity.rotation,
		entity.velocity,
	])
}
