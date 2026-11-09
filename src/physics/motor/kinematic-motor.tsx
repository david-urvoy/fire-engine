import { type PropsWithChildren } from 'react'

import { useEntity, type CharacterDimensions } from '../../game'
import { PhysicBody, type PhysicBodyProps } from '../body'
import { useCharacterController } from '../character-controller'
import { useCharacterMovement } from './use-controlled-rigid-body'

export function KinematicMotor({
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & PhysicBodyProps>) {
	const { entity } = useEntity()
	const characterController = useCharacterController()
	const move = useCharacterMovement(characterController)

	return (
		<PhysicBody
			move={move}
			position={[entity.position.x, entity.position.y, entity.position.z]}
			{...props}
			type="kinematicPosition"
		>
			{children}
		</PhysicBody>
	)
}
