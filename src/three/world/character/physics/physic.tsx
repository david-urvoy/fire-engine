import { useFrame } from '@react-three/fiber'
import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	type RigidBodyProps,
} from '@react-three/rapier'
import { type PropsWithChildren, useRef } from 'react'
import { type CharacterDimensions, characterDimensions, game, useEntity } from '../../../../game'
import { timer } from '../../../../game/time/timer'
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

	useFrame(() => {
		if (!body.current || !controller.current) return

		const delta = timer.getDelta()

		controller.current.computeColliderMovement(
			body.current.collider(0),
			entity.controls.velocity.multiplyScalar(delta),
		)
		entity.controls.velocity
			.copy(controller.current.computedMovement())
			.add(body.current.translation())

		body.current.setNextKinematicTranslation(entity.controls.velocity)
		body.current.setRotation(entity.controls.orientation, false)

		entity.physic.position.copy(body.current.translation())
		entity.physic.orientation.copy(body.current.rotation())
	}, 50)

	return (
		<RigidBody ref={body} type={props.type ?? 'kinematicPosition'} colliders={false} {...props}>
			{children}
			<CapsuleCollider args={[halfHeight, radius]} activeCollisionTypes={8704} />
		</RigidBody>
	)
}
