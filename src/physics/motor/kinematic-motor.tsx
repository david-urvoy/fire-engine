import { type RapierRigidBody, type RigidBodyProps } from '@react-three/rapier'
import { type PropsWithChildren, useRef } from 'react'

import { type CharacterDimensions } from '../../game'
import { useCharacterController } from '../character-controller'
import { Physic } from '../physic'
import { useCharacterMovement } from './use-controlled-rigid-body'

export function KinematicMotor({
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & RigidBodyProps>) {
	const controller = useCharacterController()
	const bodyRef = useRef<RapierRigidBody>(null)
	const move = useCharacterMovement(bodyRef, controller)

	return (
		<Physic rigidBodyRef={bodyRef} move={move} {...props} type="kinematicPosition">
			{children}
		</Physic>
	)
}
