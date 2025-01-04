import type { Vector2 } from 'three'
import { useSnapshot } from 'valtio'
import { game } from '../store/game-store'
import { gamepad } from './gamepad/gamepad'
import { keyboard } from './keyboard/keyboard-controls'

export function usePlayerMove(): Vector2 {
	const { isMobile } = useSnapshot(game)
	return isMobile ? gamepad.direction : keyboard.direction
}
export function useSubscribePlayerMove(): Vector2 {
	const { isMobile } = useSnapshot(game)
	const gamepadDirection = useSnapshot(gamepad.direction)
	const keyboardDirection = useSnapshot(keyboard.direction)
	return isMobile ? gamepadDirection : keyboardDirection
}

export function usePlayerAction() {}
