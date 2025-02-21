import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type RefObject, useCallback, useRef } from 'react'
import { type Camera, type Group, Quaternion, Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { FORWARD } from '../../game'
import { PointerLock } from './pointer-lock'
import { usePlayerMove } from './use-player-controls'

const targetPosition = new Vector3()

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
	const orbit = useRef<OrbitControlsImpl>(null)
	const { orientation, target } = PlayerControls

	const direction = usePlayerMove()

	const updateOrientation = useCallback(
		(camera: Camera) =>
			orientation.setFromUnitVectors(FORWARD, camera.getWorldDirection(new Vector3()).setY(0).negate().normalize()),
		[orientation],
	)

	useFrame(({ camera }, delta) => {
		if (!target.current || !orbit.current) return

		camera.position.sub(targetPosition).add(target.current.getWorldPosition(targetPosition))
		orbit.current.target.copy(targetPosition)

		updateOrientation(camera)

		// move character in direction
		const [x, z] = direction
		PlayerControls.velocity
			.setX(x)
			.setZ(z)
			.applyQuaternion(PlayerControls.orientation)
			.setY(0)
			.normalize()
			.multiplyScalar(7.5 * delta * 60)
	}, 100)

	return (
		<PointerLock controls={orbit}>
			<OrbitControls ref={orbit} minDistance={2} maxDistance={6} makeDefault />
		</PointerLock>
	)
}
