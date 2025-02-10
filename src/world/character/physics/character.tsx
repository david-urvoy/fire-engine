import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, type RapierRigidBody, RigidBody, type RigidBodyProps, useRapier } from '@react-three/rapier'
import { type PropsWithChildren, type RefObject, useCallback, useRef } from 'react'
import { type Camera, type Quaternion, Vector3 } from 'three'
import { type CharacterDimensions, GRAVITY_CONST, characterDimensions } from '../../../store/game-store'
import { timer } from '../../../store/time-store'
import { useCharacterController } from './character-controller'

interface CharacterProps {
	velocity: Vector3
	orientation: Quaternion
	dimensions?: CharacterDimensions
	onUpdate?: ((camera: Camera) => void)[]
}

const translation = new Vector3()

export function Character({
	velocity,
	orientation,
	dimensions: { halfHeight, radius } = characterDimensions,
	children,
	...props
}: PropsWithChildren<CharacterProps & RigidBodyProps>) {
	const body = useRef<RapierRigidBody>(null)
	const controller = useCharacterController()
	const gravityComponent = useRef(0)
	const grounded = useRef(false)

	useFrame(() => {
		const delta = timer.getDelta()

		if (body.current) {
			translation.copy(velocity).y += gravityComponent.current

			controller.computeColliderMovement(body.current.collider(0), translation.multiplyScalar(delta))
			translation.copy(controller.computedMovement()).add(body.current.translation())

			translation.x = Math.round(translation.x * 1000) / 1000
			translation.y = Math.round(translation.y * 1000) / 1000
			// if (Math.abs(translation.y) < 0.03) translation.y = 0
			translation.z = Math.round(translation.z * 1000) / 1000

			body.current.setNextKinematicTranslation(translation)
			body.current.setRotation(orientation, false)

			if (controller.computedGrounded() !== grounded.current) {
				grounded.current = controller.computedGrounded()
			}
			if (grounded.current) gravityComponent.current = 0
			gravityComponent.current -= GRAVITY_CONST * delta
		}
	}, 50)

	return (
		<RigidBody ref={body} type="kinematicPosition" colliders={false} {...props}>
			{children}
			<CapsuleCollider args={[halfHeight, radius]} activeCollisionTypes={8704} />
		</RigidBody>
	)
}

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
