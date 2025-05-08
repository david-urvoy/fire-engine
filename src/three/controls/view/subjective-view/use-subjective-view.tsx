import { useFrame, useThree } from '@react-three/fiber'
import { type Camera, Vector3 } from 'three'
import { FORWARD, timer } from '../../../../game'
import { ControlledCharacter, playerDirection } from '../../use-player-controls'

function useFollowCameraOrientation() {
	const { camera } = useThree()

	return () => {
		// set orientation to camera direction
		ControlledCharacter.orientation.setFromUnitVectors(
			FORWARD,
			camera.getWorldDirection(new Vector3()).setY(0).negate().normalize(),
		)

		// set velocity to player direction
		const [x, z] = playerDirection
		const delta = timer.getDelta()
		ControlledCharacter.velocity
			.setX(x)
			.setZ(z)
			.applyQuaternion(ControlledCharacter.orientation)
			.setY(0)
			.multiplyScalar(7.5 * delta * 60)
	}
}

export function useSubjectiveView(updateCamera?: (camera: Camera) => void) {
	const followCameraOrientation = useFollowCameraOrientation()

	useFrame(({ camera }) => {
		followCameraOrientation()
		updateCamera?.(camera)
	})
}
