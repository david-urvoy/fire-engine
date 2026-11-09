import { useCallback } from 'react'

import { useEntity } from '../../game'

export function useTeleport() {
	const { entity } = useEntity()

	return useCallback(() => {
		const body = entity.runtime.rigidBody
		const physic = entity.physic
		const controls = entity.controls
		if (!body || !physic || !controls.teleport) return

		body.setTranslation(controls.teleport, false)

		entity.position.copy(controls.teleport)
		entity.velocity.set(0, 0, 0)
		physic.setGrounded(false)

		controls.setTeleport(undefined)
	}, [entity])
}
