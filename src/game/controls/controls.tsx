import type { RefObject } from 'react'
import { type Group, Quaternion, type Vector2, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { game } from '../game.store'
import { Gamepad, gamepad } from './gamepad/gamepad'
import { KeyboardControls, useSubscribeKey } from './keyboard/keyboard-controls'
import { keyboard, useKeyboardDirection } from './keyboard/keyboard.store'
import { Keymap } from './keyboard/keymap'

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
	return game.isMobile ? gamepad.direction : keyboard.direction
}

export function useSubscribePlayerDirection(): Vector2 {
	const { isMobile } = useSnapshot(game)
	const gamepadDirection = useSnapshot(gamepad).direction
	const keyboardDirection = useKeyboardDirection()
	return isMobile ? gamepadDirection : keyboardDirection
}

export function usePlayerAction() {}

export function useFullscreen() {
	useSubscribeKey('KeyO', () => {
		if (!document.fullscreenEnabled) return
		return !document.fullscreenElement ? game.canvas.current?.requestFullscreen() : document.exitFullscreen()
	})
}
