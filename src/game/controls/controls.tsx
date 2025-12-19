import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Group, Quaternion, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { playableCharacters, useControlledCharacter } from '../entity/entity.store'
import { game } from '../game.store'
import { timer } from '../time/timer'
import { useFullscreen } from './bindings/fullscreen'
import { gamepad, Gamepad } from './input/gamepad/gamepad'
import { KeyboardControls } from './input/keyboard/keyboard-controls'
import { keyboard } from './input/keyboard/keyboard.store'
import { Keymap } from './input/keyboard/keymap'

function usePlayerDirection() {
	const { isMobile } = useSnapshot(game)
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
	useFullscreen()

	return isMobile ? <Gamepad /> : <KeyboardControls map={Keymap} />
}

export function useControlled(name: string) {
	const groupRef = useRef<Group>(null)

	if (!playableCharacters.entities[name]) {
		playableCharacters.controlled = name
		playableCharacters.entities[name] = {
			ref: groupRef,
			name,
			controls: {
				name,
				velocity: new Vector3(),
				orientation: new Quaternion(),
			},
			physic: {
				position: new Vector3(),
				orientation: new Quaternion(),
			},
			visual: {
				position: new Vector3(),
				orientation: new Quaternion(),
			},
		}
	}

	const isControlled = playableCharacters.controlled === name

	return { isControlled, ...playableCharacters.entities[name] }
}
