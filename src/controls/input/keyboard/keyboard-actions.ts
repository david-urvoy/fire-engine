import { Vector3 } from 'three'
import { CameraType } from '../../../camera'
import { game } from '../../../game'
import { useToggleFullscreen } from '../../bindings/fullscreen'
import type { Action } from './keymap'

export function useKeyboardActions(): Partial<Record<Action, () => void>> {
	const toggleFullscreen = useToggleFullscreen()

	return {
		mobile: game.toggleMobile,
		toggleDebug: game.toggleDebug,
		switchCameraType: () => {
			CameraType.type =
				CameraType.type === 'first-person'
					? 'orbit'
					: CameraType.type === 'orbit'
						? 'third-person'
						: 'first-person'
		},
		pause: game.pause,
		fullscreen: toggleFullscreen,
		snap: () => {
			const sphere = game.entities.get('sphere')
			sphere.teleportTo(new Vector3(2.65, sphere.position.y === 2 ? 3 : 2, -1.5))
		},
	}
}
