import { useFrame } from '@react-three/fiber'
import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	type RigidBodyProps,
} from '@react-three/rapier'
import { type PropsWithChildren, useEffect, useRef } from 'react'
import { Quaternion, Vector3 } from 'three'
import { type CharacterDimensions, characterDimensions, game, useEntity } from '../../../../game'
import { GameLoopSystem } from '../../../../game/entity/game-loop.system'
import { useCharacterController } from './character-controller'

export function Physic({
	dimensions: { halfHeight, radius } = characterDimensions,
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & RigidBodyProps>) {
	const body = useRef<RapierRigidBody>(null)
	const controller = useCharacterController()

	const { id } = useEntity()

	const entity = game.entities[id]
	if (!entity) throw new Error(`Entity "${id}" not found`)

	useEffect(() => {
		if (!body.current || !controller.current) return

		if (!entity.physic) {
			entity.physic = {
				position: new Vector3().copy(body.current.translation()),
				orientation: new Quaternion(),
				isGrounded: true,
				velocity: new Vector3(),
				dynamic: props.type !== 'fixed',
			}
		}

		GameLoopSystem.systems.characterController.register({
			entity,
			controller: controller.current,
			collider: body.current.collider(0),
		})

		return () => {
			GameLoopSystem.systems.characterController.unregister(entity.id)
		}
	}, [entity, controller, props.type])

	useFrame(() => {
		if (!body.current || !entity.physic) return

		body.current.setNextKinematicTranslation(entity.physic.position)
		body.current.setRotation(entity.physic.orientation, false)
	}, 50)

	return (
		<RigidBody ref={body} type={props.type ?? 'kinematicPosition'} colliders={false} {...props}>
			{children}
			<CapsuleCollider args={[halfHeight, radius]} activeCollisionTypes={8704} />
		</RigidBody>
	)
}
