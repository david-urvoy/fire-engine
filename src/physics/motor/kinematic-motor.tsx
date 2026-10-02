import { type PropsWithChildren } from 'react'

import { type CharacterDimensions } from '../../game'
import { Body, type BodyProps } from '../body'
import { useCharacterMovement } from './use-controlled-rigid-body'

export function KinematicMotor({
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & BodyProps>) {
	const move = useCharacterMovement()

	return (
		<Body move={move} {...props} type="kinematicPosition" debug>
			{children}
		</Body>
	)
}
