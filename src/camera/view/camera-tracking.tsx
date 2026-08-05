import { useFrame } from '@react-three/fiber'

import { game, UP, useEntity } from '../../game'

function CameraPosition() {
	const { entity } = useEntity()

	useFrame(({ camera }) => {
		camera.position.copy(entity.position)
		camera.position.y += 0.4
	})

	return <></>
}

function CameraOrientation() {
	const { entity } = useEntity()

	useFrame(() => {
		const controls = game.pointerLockControls.current
		if (!controls) return

		const q = controls.getObject().quaternion
		const yaw = Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.z * q.z))

		entity.orientation.setFromAxisAngle(UP, yaw)
	})

	return <></>
}

export function CameraTracking() {
	return (
		<>
			<CameraPosition />
			<CameraOrientation />
		</>
	)
}
