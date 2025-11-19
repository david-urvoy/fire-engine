import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, type RapierRigidBody, RigidBody, type RigidBodyProps, useRapier } from '@react-three/rapier'
import { type RefObject, useCallback, useRef } from 'react'
import { type Group, type Object3DEventMap, Quaternion, Vector3 } from 'three'
import { type CharacterDimensions, GRAVITY_CONST, characterDimensions } from '../../../../game'
import { timer } from '../../../../game/time/timer'
import { useCharacterController } from './character-controller'

interface PhysicProps {
	velocity: Vector3
	orientation: Quaternion
	dimensions?: CharacterDimensions
	anchor?: RefObject<Group<Object3DEventMap> | null>
}

const translation = new Vector3()

export function Physic({
	velocity = new Vector3(),
	orientation = new Quaternion(),
	dimensions: { halfHeight, radius } = characterDimensions,
	children,
	anchor,
	...props
}: PhysicProps & RigidBodyProps) {
	const body = useRef<RapierRigidBody>(null)
	const controller = useCharacterController()
	const gravityComponent = useRef(0)
	const grounded = useRef(false)

	useFrame(() => {
		const delta = timer.getDelta()

		if (!body.current || !controller.current) return

		translation.copy(velocity).y += gravityComponent.current
		controller.current.computeColliderMovement(body.current.collider(0), translation.multiplyScalar(delta))
		translation.copy(controller.current.computedMovement()).add(body.current.translation())

		body.current.setNextKinematicTranslation(translation)
		body.current.setRotation(orientation, false)

		if (controller.current.computedGrounded() !== grounded.current) {
			grounded.current = controller.current.computedGrounded()
		}
		if (grounded.current) gravityComponent.current = 0
		gravityComponent.current -= GRAVITY_CONST * delta

		anchor?.current?.position.copy(body.current.translation())
		anchor?.current?.quaternion.copy(body.current.rotation())


	}, 50)

	return (
		<RigidBody ref={body} type="kinematicPosition" colliders={false} {...props}>
			<group ref={anchor} />
			{children}
			<CapsuleCollider args={[halfHeight, radius]} activeCollisionTypes={8704} />
		</RigidBody>
	)
}

/* oxlint-disable no-unused-vars */
// @ts-ignore
function useExtractFromGround(bodyRef: RefObject<RapierRigidBody>, { halfHeight, radius }: CharacterDimensions) {
	const { rapier, world } = useRapier()

	const rayOrigin = useRef(new Vector3())
	const ray = useRef(new rapier.Ray(rayOrigin.current, new Vector3(0, -1, 0)))

	return useCallback(() => {
		if (bodyRef.current) {
			const body = bodyRef.current
			rayOrigin.current.copy(body.translation())
			rayOrigin.current.y += halfHeight + radius

			const hit = world.castRay(ray.current, 15, false, undefined, undefined, undefined, body)
			if (hit) {
				rayOrigin.current.y = halfHeight + radius + ray.current.pointAt(hit?.timeOfImpact).y + 0.01
				body.setTranslation(rayOrigin.current, true)
			}
		}
	}, [bodyRef, halfHeight, radius, world])
}
