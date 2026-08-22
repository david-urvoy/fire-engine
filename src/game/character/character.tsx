import { CapsuleCollider } from '@react-three/rapier'

import { Visual } from '../../3d/visual/visual'
import { eventBus } from '../../lib'
import { Gravity, KinematicMotor } from '../../physics'
import { Entity, type EntityProps } from '../entity/entity'
import { characterDimensions } from '../game.store'
import { CharacterProvider } from './character.context'
import { Character as CharacterModel } from './character.model'

export function Character({
	id,
	position = [0, 0, 0],
	height = characterDimensions.height,
	children,
	...props
}: EntityProps & { height?: number; name: string; position?: [number, number, number] }) {
	return (
		<Entity id={id} {...props}>
			<CharacterProvider character={new CharacterModel(id, props.name, '', 0)}>
				<KinematicMotor colliders={false} position={position}>
					<CapsuleCollider
						args={[(height - characterDimensions.radius * 2) * 0.5, characterDimensions.radius]}
					/>
					<Visual
						onClick={() => eventBus.emit('character_interacted', { characterId: id })}
						interactable
					>
						{children}
					</Visual>
				</KinematicMotor>
				<Gravity />
			</CharacterProvider>
		</Entity>
	)
}
