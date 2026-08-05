import { RigidBody, type RapierRigidBody, type RigidBodyProps } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import type { Vector3 } from 'three'

import { useEntity, useGameLoopSystem } from '../game'

export function Physic({ move, ...props }: RigidBodyProps & { move?: (delta: Vector3) => void }) {
	const { entity } = useEntity()
	const { physic } = useGameLoopSystem()
	const bodyRef = useRef<RapierRigidBody>(null)

	useEffect(() => {
		if (!entity.physic) return

		entity.physic.isActive = true
		physic.register({
			entity,
			move:
				move ??
				(() => {
					if (!bodyRef.current) return
					if (entity.physic) entity.physic.isSleeping = bodyRef.current.isSleeping()
					entity.position.copy(bodyRef.current.translation())
				}),
		})

		return () => physic.unregister(entity.id)
	}, [physic, entity, move])

	return <RigidBody ref={bodyRef} position={entity.position} {...props} />
}
