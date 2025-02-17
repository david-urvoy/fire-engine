import { CameraControls, type CameraControlsProps } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type RefObject, useCallback, useEffect, useRef } from 'react'
import { type Group, Matrix4, Quaternion, Spherical, Vector3 } from 'three'
import { VERTICAL, ZERO } from '../../game'
import { usePlayerMove } from './use-player-controls'

const mx = new Matrix4()

const sphere = new Spherical()
const direction = new Vector3()

const cameraPosition = new Vector3()
const targetPosition = new Vector3()
const previousTargetPosition = new Vector3()

export const PlayerControls: {
	velocity: Vector3
	orientation: Quaternion
	target: RefObject<Group | null>
} = {
	velocity: new Vector3(),
	orientation: new Quaternion(),
	target: { current: null },
}

export function ThirdPersonControls() {
	const cameraControls = useRef<CameraControls>(null)
	const { orientation, target } = PlayerControls

	useMove()
	usePointerLock(cameraControls)

	const updateOrientation = useCallback<CameraControlsProps['onChange']>(
		(e: {
			type: 'update'
		}) => {
			if (e?.type === 'update' || !cameraControls.current) return

			cameraControls.current.getSpherical(sphere)
			direction.setFromSpherical(sphere).negate()
			mx.lookAt(direction.setY(0), ZERO, VERTICAL)
			orientation.setFromRotationMatrix(mx)
		},
		[orientation],
	)

	useFrame(() => {
		if (!target.current || !cameraControls.current) return

		target.current.getWorldPosition(targetPosition)

		cameraControls.current.getPosition(cameraPosition)
		cameraPosition.add(targetPosition).sub(previousTargetPosition)

		cameraControls.current.setLookAt(
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
			<CameraControls
				ref={cameraControls}
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
	const controller = new AbortController()
	useEffect(() => {
		addEventListener('focus', subscribeFocus, { signal: controller.signal })
		addEventListener('click', subscribeFocus, { signal: controller.signal })
		return () => {
			unsubscribeFocus()
			controller.abort()
		}
	}, [subscribeFocus, unsubscribeFocus, controller])
}

function useMove() {
	const direction = usePlayerMove()

	useFrame(() => {
		const [x, z] = direction
		PlayerControls.velocity.setX(x).setZ(z).applyQuaternion(PlayerControls.orientation).setY(0).multiplyScalar(7.5)
	})
}
