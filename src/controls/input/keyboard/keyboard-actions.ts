import { ControlsType } from '../../../camera'
import { game } from '../../../game'
import { toggleFullscreen } from '../../bindings/fullscreen'
import type { Action } from './keymap'

export const KeyboardActions: Partial<Record<Action, () => void>> = {
	mobile: game.toggleMobile,
	toggleDebug: game.toggleDebug,
	switchCameraType: () => {
		ControlsType.type =
			ControlsType.type === 'first-person'
				? 'orbit'
				: ControlsType.type === 'orbit'
					? 'third-person'
					: 'first-person'
	},
	pause: game.pause,
	fullscreen: toggleFullscreen,
}
