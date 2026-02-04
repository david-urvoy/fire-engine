import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	type RigidBodyProps,
} from '@react-three/rapier'
import { type PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { Quaternion, Vector3 } from 'three'
import { type CharacterDimensions, characterDimensions, useEntity } from '../../../../game'
import { GameLoopSystem } from '../../../../game/entity/game-loop.system'
import { useCharacterController } from './character-controller'

export function Physic({
	dimensions: { halfHeight, radius } = characterDimensions,
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & RigidBodyProps>) {
	const { entity } = useEntity()
	const controller = useCharacterController()
	const body = useRef<RapierRigidBody>(null)

	const move = useCallback(
		(delta: Vector3) => {
			if (!body.current || !entity.physic) return

			const { physic, controls, visual } = entity

			if (controls.teleport) {
				const target = controls.teleport

				body.current.setTranslation(target, false)

				physic.position.copy(target)
				physic.velocity.set(0, 0, 0)
				physic.isGrounded = false

				visual.snap = true
				controls.teleport = undefined

				return
			}

			if (!controller.current) return

			controller.current.computeColliderMovement(body.current.collider(0), delta)
			physic.position.copy(body.current.translation()).add(controller.current.computedMovement())

			physic.isGrounded = controller.current?.computedGrounded() ?? false
			body.current.setRotation(physic.orientation, false)

			body.current.setNextKinematicTranslation(physic.position)
		},
		[controller, entity.physic, entity.controls, entity.visual],
	)

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
