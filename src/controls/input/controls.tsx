import { useSnapshot } from 'valtio'

import { game } from '../../game'
import { Gamepad } from './gamepad/gamepad'
import { KeyboardControls } from './keyboard/keyboard-controls'
import { Keymap } from './keyboard/keymap'

export function Controls() {
	const {
		responsive: { isMobile },
	} = useSnapshot(game)

	return isMobile ? <Gamepad /> : <KeyboardControls map={Keymap} />
}
