import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Vector2 } from 'three'
import { Vector3 } from 'three/src/math/Vector3.js'
import { useSnapshot } from 'valtio'

import { CameraTracking } from '../camera'
import { useEntity } from '../game'
import { usePlayer } from '../game/character/use-player'
import { game } from '../game/game.store'
import { gamepad } from './input/gamepad/gamepad'
import { useKeyboardMovement } from './input/keyboard/keyboard.store'

function usePlayerDirection(): [Vector2, number] {
	const { isMobile } = useSnapshot(game.responsive)
	const keyboardDirection = useKeyboardMovement()
	return isMobile ? [gamepad.direction, 1] : keyboardDirection
}

function useCharacterMove() {
	const { uiMode } = useSnapshot(game)
	const getPlayer = usePlayer()
	const [direction, speed] = usePlayerDirection()
	const movement = useRef(new Vector3())

	useEffect(() => {
		const player = getPlayer()
		if (!player || (uiMode !== 'gameplay' && uiMode !== 'playerMenu')) return

		movement.current.set(direction.x, 0, direction.y)
		player.controls.isMoving = movement.current.length() > 0
	}, [direction.x, direction.y, uiMode, getPlayer])

	useFrame(() => {
		const player = getPlayer()
		if (!player) return

		const target = movement.current.clone().applyQuaternion(player.rotation).multiplyScalar(8)
		player.moveBy(target, speed)
	})
}

function Controllable() {
	const { id } = useEntity()
	useCharacterMove()

	useEffect(() => {
		game.controlledCharacter = id
	}, [id])

	return <CameraTracking />
}

function ControllableWrapper() {
	const { camera } = useSnapshot(game)
	if (camera.type === 'orbit') return null

	return <Controllable />
}

export { ControllableWrapper as Controllable }
