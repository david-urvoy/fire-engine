import { CapsuleCollider } from '@react-three/rapier'
import { useEffect } from 'react'

import { Visual } from '../../3d/visual/visual'
import { eventBus } from '../../lib'
import { Gravity, KinematicMotor } from '../../physics'
import { Entity, type EntityProps } from '../entity/entity'
import { useGame } from '../game.context'
import { characterDimensions } from '../game.store'
import { CharacterProvider } from './character.context'

export function Character({
	id,
	position = [0, 0, 0],
	children,
	...props
}: EntityProps & { name: string }) {
	const { characterManager } = useGame()

	useEffect(() => {
		characterManager.create(id)
		return () => characterManager.delete(id)
	}, [id, characterManager])

	return (
		<CharacterProvider id={id} name={props.name}>
			<Entity id={id} position={position} {...props}>
				<KinematicMotor>
					<CapsuleCollider args={[characterDimensions.halfHeight, characterDimensions.radius]} />
					<Visual
						onClick={() => eventBus.emit('character_interacted', { characterId: id })}
						interactable
					>
						{children}
					</Visual>
				</KinematicMotor>
				<Gravity />
			</Entity>
		</CharacterProvider>
	)
}
