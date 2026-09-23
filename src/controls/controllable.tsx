import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three/src/math/Vector3.js'
import { useSnapshot } from 'valtio'

import { CameraTracking } from '../camera'
import { useEntity } from '../game'
import { usePlayer } from '../game/character/use-player'
import { game } from '../game/game.store'
import { gamepad } from './input/gamepad/gamepad'
import { useKeyboardDirection } from './input/keyboard/keyboard.store'

function usePlayerDirection() {
	const { isMobile } = useSnapshot(game.responsive)
	const keyboardDirection = useKeyboardDirection()
	return isMobile ? gamepad.direction : keyboardDirection
}

function useCharacterMove() {
	const { uiMode } = useSnapshot(game)
	const getPlayer = usePlayer()
	const direction = usePlayerDirection()
	const vec = useRef(new Vector3())

	useFrame(() => {
		const player = getPlayer()
		if (!player || (uiMode !== 'gameplay' && uiMode !== 'hud')) return

		vec.current
			.set(direction.x, 0, direction.y)
			.applyQuaternion(player.orientation)
			.multiplyScalar(8)

		player.moveBy([vec.current.x, vec.current.y, vec.current.z])
	})
}

export function Controllable() {
	const { id } = useEntity()
	useCharacterMove()

	useEffect(() => {
		game.controlledCharacter = id
	}, [id])

	return <CameraTracking />
}
