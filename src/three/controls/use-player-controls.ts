import type { RefObject } from 'react'
import { type Group, Quaternion, type Vector2, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { game } from '../../game'
import { gamepad } from './gamepad/gamepad'
import { keyboard } from './keyboard/keymap'

export const ControlledCharacter: {
	velocity: Vector3
	orientation: Quaternion
	ref: RefObject<Group | null>
} = {
	velocity: new Vector3(),
	orientation: new Quaternion(),
	ref: { current: null },
}

export const playerDirection = game.isMobile ? gamepad.direction : keyboard.direction

export function useSubscribePlayerDirection(): Vector2 {
	const { isMobile } = useSnapshot(game)
	const gamepadDirection = useSnapshot(gamepad).direction
	const keyboardDirection = useSnapshot(keyboard).direction
	return isMobile ? gamepadDirection : keyboardDirection
}

export function usePlayerAction() {}
