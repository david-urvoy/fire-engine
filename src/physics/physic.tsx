import { RigidBody, type RigidBodyProps } from '@react-three/rapier'
import { useEffect } from 'react'
import type { Vector3 } from 'three'

import { useEntity, useGameLoopSystem } from '../game'

export function Physic({
	move,
	...props
}: RigidBodyProps & {
	move?: (delta: Vector3) => void
}) {
	const { entity } = useEntity()
	const { physic } = useGameLoopSystem()

	useEffect(() => {
		if (!entity.physic) return

		physic.register({
			entity,
			move,
		})

		return () => physic.unregister(entity.id)
	}, [physic, entity, move])

	return <RigidBody ref={entity.runtime.rigidBody} position={entity.position} {...props} />
}
