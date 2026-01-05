import { type Action, game } from '../../..'
import { ControlsType } from '../../../../three'
import { toggleFullscreen } from '../../bindings/fullscreen'

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
