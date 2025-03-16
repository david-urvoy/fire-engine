import { useFrame } from '@react-three/fiber'
import { useCallback } from 'react'
import { type Camera, Vector3 } from 'three'
import { FORWARD } from '../../../game'
import { CameraTarget } from '../../camera/camera-target'
import { usePlayerDirection } from '../use-player-controls'

export function useCameraTracking() {
	const { orientation, ref: target } = CameraTarget
	const direction = usePlayerDirection()

	const updateOrientation = useCallback(
		(camera: Camera) =>
			orientation.setFromUnitVectors(FORWARD, camera.getWorldDirection(new Vector3()).setY(0).negate().normalize()),
		[orientation],
	)

	useFrame(({ camera }, delta) => {
		if (!target.current) return

		updateOrientation(camera)

		// move character in direction
		const [x, z] = direction
		CameraTarget.velocity
			.setX(x)
			.setZ(z)
			.applyQuaternion(CameraTarget.orientation)
			.setY(0)
			.normalize()
			.multiplyScalar(7.5 * delta * 60)
	}, 100)
}
