import { useFrame } from '@react-three/fiber'
import { game, UP } from '../../game'
import { useControlledCharacter } from '../../game/character/controlled-character'

export function CameraTracking() {
	const controlledCharacter = useControlledCharacter()

	useFrame(({ camera }) => {
		if (!controlledCharacter) return

		camera.position.copy(controlledCharacter.visual.position)
		camera.position.y += 0.4
	})

	return <></>
}

export function CameraOrientation() {
	const controlledCharacter = useControlledCharacter()

	useFrame(() => {
		if (!controlledCharacter) return

		const controls = game.pointerLockControls.current
		if (!controls) return

		const q = controls.getObject().quaternion
		const yaw = Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.z * q.z))

		controlledCharacter.orientation.setFromAxisAngle(UP, yaw)
	})

	return <></>
}
