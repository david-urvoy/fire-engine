import { useEffect, useLayoutEffect } from 'react'

import { useEntity, useGameLoopSystem } from '../..'

export function useRegisterVisual() {
	const { entity } = useEntity()
	const { physic } = useGameLoopSystem()

	useEffect(() => {
		physic.register({ entity })

		return () => physic.unregister(entity.id)
	}, [physic, entity])

	useLayoutEffect(() => {
		entity.runtime.object3D?.current?.traverse((child) => {
			child.userData.entityId = entity.id
		})

		return () => (entity.runtime.object3D = undefined)
	}, [entity])
}
