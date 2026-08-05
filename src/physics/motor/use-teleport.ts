import type { RapierRigidBody } from '@react-three/rapier'
import { useCallback, type RefObject } from 'react'

import { useEntity } from '../../game'

export function useTeleport(bodyRef: RefObject<RapierRigidBody | null>) {
	const { entity } = useEntity()
	const { physic, controls } = entity

	return useCallback(() => {
		const body = bodyRef?.current
		if (!body || !physic || !controls.teleport) return

		body.setTranslation(controls.teleport, false)

		entity.position.copy(controls.teleport)
		physic.velocity.set(0, 0, 0)
		physic.isGrounded = false

		controls.teleport = undefined
	}, [physic, controls, entity.position, bodyRef])
}
