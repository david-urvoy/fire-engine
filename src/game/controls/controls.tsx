import { useFrame } from '@react-three/fiber'
import type { RefObject } from 'react'
import { type Group, Quaternion, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { FORWARD, game } from '../game.store'
import { timer } from '../time/timer'
import { Gamepad, gamepad } from './actions/gamepad/gamepad'
import { KeyboardControls } from './actions/keyboard/keyboard-controls'
import { keyboard } from './actions/keyboard/keyboard.store'
import { Keymap } from './actions/keyboard/keymap'
import { useFullscreen } from './view/fullscreen'

export function Controls() {
	const { isMobile } = useSnapshot(game)
	useFullscreen()

	return isMobile ? <Gamepad /> : <KeyboardControls map={Keymap} />
}

export const ControlledCharacter: {
	velocity: Vector3
	orientation: Quaternion
	ref: RefObject<Group | null>
} = {
	velocity: new Vector3(),
	orientation: new Quaternion(),
	ref: { current: null },
}

export function usePlayerDirection() {
	const { isMobile } = useSnapshot(game)
	return (isMobile ? gamepad : keyboard).direction
}
export function useCharacterMove() {
	const direction = usePlayerDirection()
	useFrame(() => {
		// set velocity to player direction
		const delta = timer.getDelta()
		ControlledCharacter.velocity
			.setX(direction.x)
			.setZ(direction.y)
			.applyQuaternion(ControlledCharacter.orientation)
			.setY(0)
			.multiplyScalar(7.5 * delta * 60)
	})
}
export function useCameraFollowsTargetOrientation() {
	useFrame(({ camera }) => {
		// set orientation to camera direction
		ControlledCharacter.orientation.setFromUnitVectors(
			FORWARD,
			camera.getWorldDirection(new Vector3()).setY(0).negate().normalize(),
		)
	})
}
