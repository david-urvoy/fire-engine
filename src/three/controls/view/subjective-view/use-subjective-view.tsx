import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { type Camera, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { FORWARD, timer } from '../../../../game'
import { keyboard } from '../../keyboard/keymap'
import { ControlledCharacter, playerDirection } from '../../use-player-controls'

function useFollowCameraOrientation() {
	const { camera } = useThree()

	const { up, down, right, left, shift } = useSnapshot(keyboard.state)
	const z = +up - +down
	const x = +left - +right
	const speed = (!shift ? 3 : 1) * 0.4
	keyboard.direction.set(x, z).multiplyScalar(speed)

	useEffect(() => {
		console.log('keyboard.direction', keyboard.direction)
	}, [])

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
