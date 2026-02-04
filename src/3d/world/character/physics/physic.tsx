import { useFrame } from '@react-three/fiber'
import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	type RigidBodyProps,
} from '@react-three/rapier'
import { type PropsWithChildren, useCallback, useEffect, useRef } from 'react'
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
	const next = useRef(new Vector3())

	const { id } = useEntity()

	const entity = game.entities[id]
	if (!entity) throw new Error(`Entity "${id}" not found`)

	const move = useCallback(
		(delta: Vector3) => {
			if (!body.current || !controller.current) return

			controller.current.computeColliderMovement(body.current.collider(0), delta)
			next.current.copy(body.current.translation()).add(controller.current.computedMovement())
			body.current.setNextKinematicTranslation(next.current)
		},
		[controller],
	)

	useFrame(() => {
		if (!body.current || !entity.physic) return

		entity.physic.position.copy(body.current.translation())
		entity.physic.isGrounded = controller.current?.computedGrounded() ?? false

		body.current.setRotation(entity.physic.orientation, false)
	})

	useEffect(() => {
		if (!body.current) return

		if (!entity.physic)
			entity.physic = {
				position: new Vector3().copy(body.current.translation()),
				orientation: new Quaternion(),
				isGrounded: true,
				velocity: new Vector3(),
				dynamic: props.type !== 'fixed',
			}

		GameLoopSystem.systems.physic.register({
			entity,
			move,
		})

		return () => {
			GameLoopSystem.systems.physic.unregister(entity.id)
		}
	}, [entity, props.type, move])

	return (
		<RigidBody ref={body} type={props.type ?? 'kinematicPosition'} colliders={false} {...props}>
			{children}
			<CapsuleCollider args={[halfHeight, radius]} activeCollisionTypes={8704} />
		</RigidBody>
	)
}
