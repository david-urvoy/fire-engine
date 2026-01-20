import { ControlsType } from '../../../camera'
import { game } from '../../../game'
import { useToggleFullscreen } from '../../bindings/fullscreen'
import type { Action } from './keymap'

export function useKeyboardActions(): Partial<Record<Action, () => void>> {
	const toggleFullscreen = useToggleFullscreen()

	return {
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
}
