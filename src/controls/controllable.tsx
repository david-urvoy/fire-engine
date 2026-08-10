import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three/src/math/Vector3.js'
import { useSnapshot } from 'valtio'

import { CameraTracking } from '../camera'
import { useEntity } from '../game'
import { usePlayer } from '../game/character/use-player'
import { game } from '../game/game.store'
import { gamepad, Gamepad } from './input/gamepad/gamepad'
import { KeyboardControls } from './input/keyboard/keyboard-controls'
import { useKeyboard } from './input/keyboard/keyboard.store'
import { Keymap } from './input/keyboard/keymap'

function usePlayerDirection() {
	const { isMobile } = useSnapshot(game.responsive)
	const keyboard = useKeyboard()
	const control = isMobile ? gamepad : keyboard
	return control.direction
}

function useCharacterMove() {
	const { uiMode } = useSnapshot(game)
	const getPlayer = usePlayer()
	const direction = usePlayerDirection()
	const vec = useRef(new Vector3())

	useFrame((_, delta) => {
		const player = getPlayer()
		if (!player || (uiMode !== 'gameplay' && uiMode !== 'hud')) return

		vec.current
			.set(direction.x, 0, direction.y)
			.applyQuaternion(player.orientation)
			.multiplyScalar(450 * delta)

		player.moveBy([vec.current.x, vec.current.y, vec.current.z])
	})
}

export function Controllable() {
	const { isMobile } = useSnapshot(game.responsive)
	const { id } = useEntity()
	useCharacterMove()

	useEffect(() => {
		game.controlledCharacter = id
	}, [id])

	return (
		<>
			<CameraTracking />
			{isMobile ? <Gamepad /> : <KeyboardControls map={Keymap} />}
		</>
	)
}
