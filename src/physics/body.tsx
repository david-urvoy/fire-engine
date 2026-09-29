import { RigidBody, type RigidBodyProps } from '@react-three/rapier'
import { useEffect } from 'react'
import { Vector3, type Quaternion } from 'three'

import { useSceneLayout } from '../3d/tools/use-scene-layout'
import { useEntity, useGameLoopSystem } from '../game'

export type BodyProps = RigidBodyProps & {
	position?: [number, number, number]
	move?: (translation: Vector3, rotation: Quaternion) => void
	debug?: boolean
}

export function Body({ move, position, debug = false, ...props }: BodyProps) {
	const { entity, setRuntime } = useEntity()
	const { physic } = useGameLoopSystem()

	const {
		position: { x, z },
		vertical: y,
	} = useSceneLayout({ name: entity.name, position, debug })

	useEffect(() => {
		physic.register({ entity, move })

		return () => physic.unregister(entity.id)
	}, [physic, entity, move])

	return (
		<RigidBody
			{...props}
			ref={(current) => setRuntime({ rigidBodyRef: { current } })}
			position={[x, y, z]}
		/>
	)
}
