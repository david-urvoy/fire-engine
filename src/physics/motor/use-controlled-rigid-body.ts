import type { KinematicCharacterController, Vector3 } from '@dimforge/rapier3d-compat'
import type { RapierRigidBody } from '@react-three/rapier'
import { useCallback, useEffect } from 'react'

import { useEntity, useGameLoopSystem } from '../../game'
import { useTeleport } from './use-teleport'

function useComputedMovement(
	body: RapierRigidBody | null,
	controller: KinematicCharacterController | null,
) {
	const { entity } = useEntity()

	return useCallback(() => {
		if (!body || !entity.physic || !controller) return

		entity.physic.position.copy(body.translation()).add(controller.computedMovement())
		entity.physic.isGrounded = controller.computedGrounded()

		body.setRotation(entity.physic.orientation, false)
		body.setNextKinematicTranslation(entity.physic.position)
	}, [controller, entity.physic, body])
}

export function useCharacterMovement(
	body: RapierRigidBody | null,
	controller: KinematicCharacterController | null,
) {
	const { entity } = useEntity()
	const { physic } = useGameLoopSystem()

	const applyTeleport = useTeleport(body)
	const applyComputedMovement = useComputedMovement(body, controller)

	const move = useCallback(
		(delta: Vector3) => {
			applyTeleport()

			if (!body || !controller) return

			controller.computeColliderMovement(body.collider(0), delta)
			applyComputedMovement()
		},
		[controller, body, applyTeleport, applyComputedMovement],
	)

	useEffect(() => {
		physic.register({ entity, move })
		return () => physic.unregister(entity.id)
	}, [physic, entity, move])
}
