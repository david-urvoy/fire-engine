import { type PropsWithChildren } from 'react'

import { type CharacterDimensions } from '../../game'
import { PhysicBody, type PhysicBodyProps } from '../body'
import { useCharacterMovement } from './use-controlled-rigid-body'

export function KinematicMotor({
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & PhysicBodyProps>) {
	const move = useCharacterMovement()

	return (
		<PhysicBody move={move} {...props} type="kinematicPosition">
			{children}
		</PhysicBody>
	)
}
