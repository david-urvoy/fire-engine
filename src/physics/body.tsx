import { RigidBody, type RigidBodyProps } from '@react-three/rapier'
import { useEffect } from 'react'
import { Vector3, type Quaternion } from 'three'

import { useEntity, useGameLoopSystem } from '../game'

export type PhysicBodyProps = RigidBodyProps & {
	position?: [number, number, number]
	move?: (translation: Vector3, rotation: Quaternion) => void
}

export function PhysicBody({ move, position, ...props }: PhysicBodyProps) {
	const { entity, setRuntime } = useEntity()
	const { physic } = useGameLoopSystem()

	useEffect(() => {
		physic.register({ entity, move })

		return () => physic.unregister(entity.id)
	}, [physic, entity, move])

	return (
		<RigidBody
			{...props}
			ref={(current) => setRuntime({ rigidBodyRef: { current } })}
			position={position}
		/>
	)
}
