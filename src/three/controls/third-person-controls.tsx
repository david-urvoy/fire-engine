import { CameraControls, type CameraControlsProps } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type RefObject, useCallback, useEffect, useRef } from 'react'
import { type Group, Matrix4, type Quaternion, Spherical, Vector3 } from 'three'
import { VERTICAL, ZERO } from '../../game'
import { usePlayerMove } from './use-player-controls'

type ControlProps = {
	velocity: Vector3
	orientation: Quaternion
}

const mx = new Matrix4()

const sphere = new Spherical()
const direction = new Vector3()

const cameraPosition = new Vector3()
const targetPosition = new Vector3()
const previousTargetPosition = new Vector3()

export function ThirdPersonControls({ velocity, orientation }: ControlProps) {
	const controls = useRef<CameraControls>(null)
	const target = useRef<Group>(null)

	useMove(velocity, orientation)
	usePointerLock(controls)

	const updateOrientation = useCallback<CameraControlsProps['onChange']>(
		(e: {
			type: 'update'
		}) => {
			if (e?.type === 'update' || !controls.current) return

			controls.current.getSpherical(sphere)
			direction.setFromSpherical(sphere).negate()
			mx.lookAt(direction.setY(0), ZERO, VERTICAL)
			orientation.setFromRotationMatrix(mx)
		},
		[orientation],
	)

	useFrame(() => {
		if (!target.current || !controls.current) return

		target.current.getWorldPosition(targetPosition)

		controls.current.getPosition(cameraPosition)
		cameraPosition.add(targetPosition).sub(previousTargetPosition)

		controls.current.setLookAt(
			cameraPosition.x,
			cameraPosition.y,
			cameraPosition.z,
			targetPosition.x,
			targetPosition.y,
			targetPosition.z,
		)

		target.current.getWorldPosition(previousTargetPosition)
	}, 100)

	return (
		<>
			<group ref={target} position-y={1.2} position-x={-1} />
			<CameraControls
				ref={controls}
				minDistance={2}
				maxDistance={6}
				onChange={updateOrientation}
				enabled={true}
				makeDefault
			/>
		</>
	)
}

function usePointerLock(controls: RefObject<CameraControls | null>) {
	const subscribeFocus = useCallback(() => controls.current?.lockPointer(), [controls])
	const unsubscribeFocus = useCallback(() => controls.current?.unlockPointer(), [controls])
	useEffect(() => {
		addEventListener('focus', subscribeFocus)
		addEventListener('click', subscribeFocus)
		return () => {
			unsubscribeFocus()
			removeEventListener('focus', subscribeFocus)
			removeEventListener('click', subscribeFocus)
		}
	}, [subscribeFocus, unsubscribeFocus])
}

function useMove(velocity: Vector3, orientation: Quaternion) {
	const direction = usePlayerMove()

	useFrame(() => {
		const [x, z] = direction
		velocity.setX(x).setZ(z).applyQuaternion(orientation).setY(0).multiplyScalar(7.5)
	})
}
