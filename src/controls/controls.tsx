import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three/src/math/Vector3.js'
import { useSnapshot } from 'valtio'
import { game, useControlledCharacter } from '../game/game.store'
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
	const { uiMode } = useSnapshot(game)
	const controlledCharacter = useControlledCharacter()
	const direction = usePlayerDirection()
	const vec = useRef(new Vector3())

	useFrame((_, delta) => {
		if (!controlledCharacter?.controls || uiMode !== 'gameplay') return
		// set velocity to player direction
		vec.current
			.set(direction.x, 0, direction.y)
			.applyQuaternion(controlledCharacter.orientation)
			.multiplyScalar(450 * delta)

		controlledCharacter.moveBy([vec.current.x, vec.current.y, vec.current.z])
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
