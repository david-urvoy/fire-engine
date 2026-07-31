import { type RapierRigidBody, RigidBody, type RigidBodyProps } from '@react-three/rapier'
import { type PropsWithChildren, useRef } from 'react'

import { useVisualSync } from '../../3d/visual/use-visual'
import { type CharacterDimensions } from '../../game'
import { useCharacterController } from '../character-controller'
import { useCharacterMovement } from './use-controlled-rigid-body'

export function KinematicMotor({
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & RigidBodyProps>) {
	const controller = useCharacterController()
	const body = useRef<RapierRigidBody>(null)

	useCharacterMovement(body.current, controller.current)
	useVisualSync()

	return (
		<RigidBody ref={body} type="kinematicPosition" {...props}>
			{children}
		</RigidBody>
	)
}
