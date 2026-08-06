import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Group } from 'three/src/objects/Group.js'

import { useEntity, useGameLoopSystem } from '../..'

export function useRegisterVisual() {
	const { entity } = useEntity()
	const { physic } = useGameLoopSystem()
	const objectRef = useRef<Group>(null)

	useEffect(() => {
		physic.register({ entity })

		return () => physic.unregister(entity.id)
	}, [physic, entity])

	useLayoutEffect(() => {
		const object3D = objectRef.current
		if (!object3D || !entity.runtime) return

		entity.runtime.object3D = object3D

		object3D.traverse((child) => {
			child.userData.entityId = entity.id
		})

		return () => (entity.runtime.object3D = undefined)
	}, [entity])

	return objectRef
}
