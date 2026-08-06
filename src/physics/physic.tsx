import { RigidBody, type RapierRigidBody, type RigidBodyProps } from '@react-three/rapier'
import { useEffect, useRef, type RefObject } from 'react'
import type { Vector3 } from 'three'

import { useEntity, useGameLoopSystem } from '../game'

export function Physic({
	move,
	rigidBodyRef,
	...props
}: RigidBodyProps & {
	move?: (delta: Vector3) => void
	rigidBodyRef?: RefObject<RapierRigidBody | null>
}) {
	const { entity } = useEntity()
	const { physic } = useGameLoopSystem()
	const bodyRef = useRef<RapierRigidBody>(null)

	useEffect(() => {
		if (!entity.physic) return

		entity.physic.isActive = true
		if (bodyRef.current || rigidBodyRef?.current) {
			entity.runtime.rigidBody = rigidBodyRef?.current ?? bodyRef.current ?? undefined
		}
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
	}, [physic, entity, move, rigidBodyRef])

	return <RigidBody ref={rigidBodyRef ?? bodyRef} position={entity.position} {...props} />
}
