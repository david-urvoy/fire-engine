import { type RigidBodyProps } from '@react-three/rapier'
import { type PropsWithChildren } from 'react'

import { type CharacterDimensions } from '../../game'
import { Physic } from '../physic'
import { useCharacterMovement } from './use-controlled-rigid-body'

export function KinematicMotor({
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & RigidBodyProps>) {
	const move = useCharacterMovement()

	return (
		<Physic move={move} {...props} type="kinematicPosition">
			{children}
		</Physic>
	)
}
