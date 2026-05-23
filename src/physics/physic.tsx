import {
	CapsuleCollider,
	type RapierRigidBody,
	RigidBody,
	type RigidBodyProps,
} from '@react-three/rapier'
import { type PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { Vector3 } from 'three'

import {
	type CharacterDimensions,
	characterDimensions,
	useEntity,
	useGameLoopSystem,
} from '../game'
import { useCharacterController } from './character-controller'

export function Physic({
	dimensions: { halfHeight, radius } = characterDimensions,
	children,
	...props
}: PropsWithChildren<{ dimensions?: CharacterDimensions } & RigidBodyProps>) {
	const { entity } = useEntity()
	const controller = useCharacterController()
	const body = useRef<RapierRigidBody>(null)
	const { physic } = useGameLoopSystem()

	const applyTeleport = useCallback(() => {
		const { physic, visual, controls } = entity

		if (!body.current || !physic || !controls.teleport) return

		body.current.setTranslation(controls.teleport, false)

		physic.position.copy(controls.teleport)
		physic.velocity.set(0, 0, 0)
		physic.isGrounded = false

		visual.snap = true
		controls.teleport = undefined
	}, [entity.physic, entity.visual, entity.controls])

	const applyComputedMovement = useCallback(() => {
		if (!body.current || !entity.physic || !controller.current) return

		entity.physic.position
			.copy(body.current.translation())
			.add(controller.current.computedMovement())
		entity.physic.isGrounded = controller.current.computedGrounded()

		body.current.setRotation(entity.physic.orientation, false)
		body.current.setNextKinematicTranslation(entity.physic.position)
	}, [controller, entity.physic])

	const move = useCallback(
		(delta: Vector3) => {
			applyTeleport()

			if (!body.current || !controller.current) return

			controller.current.computeColliderMovement(body.current.collider(0), delta)

			applyComputedMovement()
		},
		[controller, applyTeleport, applyComputedMovement],
	)

	useEffect(() => {
		const rigidBody = body.current ?? undefined

		entity.initPhysic(props.type !== 'fixed')
		if (entity.physic) {
			entity.physic.runtime.rigidBody = rigidBody
		}
		physic.register({
			entity,
			move,
		})

		return () => {
			const physicState = entity.physic
			if (physicState && physicState.runtime.rigidBody === rigidBody) {
				physicState.runtime.rigidBody = undefined
			}
			physic.unregister(entity.id)
		}
	}, [physic, entity, props.type, move])

	return (
		<RigidBody ref={body} type={props.type ?? 'kinematicPosition'} colliders={false} {...props}>
			{children}
			<CapsuleCollider args={[halfHeight, radius]} activeCollisionTypes={8704} />
		</RigidBody>
	)
}
