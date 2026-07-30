import type { RapierRigidBody } from '@react-three/rapier'
import { useCallback } from 'react'

import { useEntity } from '../../game'

export function useTeleport(body: RapierRigidBody | null) {
	const { entity } = useEntity()
	const { physic, visual, controls } = entity

	return useCallback(() => {
		if (!body || !physic || !controls.teleport) return

		body.setTranslation(controls.teleport, false)

		physic.position.copy(controls.teleport)
		physic.velocity.set(0, 0, 0)
		physic.isGrounded = false

		visual.snap = true
		controls.teleport = undefined
	}, [physic, visual, controls, body])
}
