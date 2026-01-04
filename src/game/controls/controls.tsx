import { useFrame } from '@react-three/fiber'
import { useSnapshot } from 'valtio'
import { game, useControlledCharacter } from '../game.store'
import { timer } from '../time/timer'
import { gamepad, Gamepad } from './input/gamepad/gamepad'
import { KeyboardControls } from './input/keyboard/keyboard-controls'
import { useKeyboard } from './input/keyboard/keyboard.store'
import { Keymap } from './input/keyboard/keymap'

function usePlayerDirection() {
	const { isMobile } = useSnapshot(game)
	const keyboard = useKeyboard()
	const control = isMobile ? gamepad : keyboard
	return control.direction
}

function useCharacterMove() {
	const controlledCharacter = useControlledCharacter()
	const direction = usePlayerDirection()

	useFrame(() => {
		if (!controlledCharacter?.controls) return
		// set velocity to player direction
		const delta = timer.getDelta()
		controlledCharacter.controls.velocity
			.setX(direction.x)
			.setZ(direction.y)
			.applyQuaternion(controlledCharacter.controls.orientation)
			.setY(0)
			.multiplyScalar(7.5 * delta * 60)
	})
}

export function Controls() {
	const { isMobile } = useSnapshot(game)
	useCharacterMove()

	return isMobile ? <Gamepad /> : <KeyboardControls map={Keymap} />
}

export function Controllable() {
	return <></>
}
