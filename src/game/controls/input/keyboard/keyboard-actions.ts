import { type Action, game } from '../../..'
import { ControlsType } from '../../../../three'
import { toggleFullscreen } from '../../bindings/fullscreen'

export const KeyboardActions: Partial<Record<Action, () => void>> = {
	mobile: () => {
		game.isMobile = !game.isMobile
	},
	toggleDebug: () => {
		game.isDebug = !game.isDebug
	},
	switchCameraType: () => {
		ControlsType.type =
			ControlsType.type === 'first-person'
				? 'orbit'
				: ControlsType.type === 'orbit'
					? 'third-person'
					: 'first-person'
	},
	pause: game.pause,
	fullscreen: () => toggleFullscreen(),
}
