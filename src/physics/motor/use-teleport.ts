import { useCallback } from 'react'

import { useEntity } from '../../game'

export function useTeleport() {
	const { entity } = useEntity()

	return useCallback(() => {
		const body = entity.runtime.rigidBody?.current
		const physic = entity.physic
		const controls = entity.controls
		if (!body || !physic || !controls.teleport) return

		body.setTranslation(controls.teleport, false)

		entity.position.copy(controls.teleport)
		physic.velocity.set(0, 0, 0)
		physic.isGrounded = false

		controls.teleport = undefined
	}, [entity])
}
