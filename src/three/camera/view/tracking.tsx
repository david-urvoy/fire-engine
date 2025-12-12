import { useFrame } from '@react-three/fiber'
import type { RefObject } from 'react'
import { Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { FORWARD, game, gamepad, timer } from '../../../game'
import { keyboard } from '../../../game/controls/input/keyboard/keyboard.store'
import { controlled } from '../../../game/entity/entity.store'

function usePlayerDirection() {
	const { isMobile } = useSnapshot(game)
	const control = isMobile ? gamepad : keyboard
	return control.direction
}

function useCharacterMove() {
	const direction = usePlayerDirection()
	const char = useSnapshot(controlled).entities['player']

	useFrame(() => {
		game.debug = direction.x + ', ' + direction.y
		// set velocity to player direction
		const delta = timer.getDelta()
		char?.velocity
			.setX(direction.x)
			.setZ(direction.y)
			.applyQuaternion(char?.orientation)
			.setY(0)
			.multiplyScalar(7.5 * delta * 60)
	})
}

function useCameraFollowsTargetOrientation() {
	const char = useSnapshot(controlled).entities['player']
	useFrame(({ camera }) => {
		// set orientation to camera direction
		char?.orientation.setFromUnitVectors(
			FORWARD,
			camera.getWorldDirection(new Vector3()).setY(0).negate().normalize(),
		)
	})
}

export function CameraTracking({ target }: { target?: RefObject<Vector3> } = {}) {
	useCameraFollowsTargetOrientation()
	useCharacterMove()
	const ref = useSnapshot(controlled).entities['player']?.ref

	useFrame(function cameraFollowsTargetPosition({ camera }) {
		const characterPosition = ref?.current?.getWorldPosition(target?.current ?? camera.position)

		if (target?.current && characterPosition)
			camera.position.sub(target.current).add(characterPosition)
	})

	return <></>
}
