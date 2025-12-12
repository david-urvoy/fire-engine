import { game } from '../../game.store'
import { useSubscribeKey } from '../input/keyboard/keyboard-controls'

export function useFullscreen() {
	useSubscribeKey('KeyO', toggleFullscreen)
}

export function toggleFullscreen() {
	if (!document.fullscreenEnabled) return
	return !document.fullscreenElement ? game.canvas.current?.requestFullscreen() : document.exitFullscreen()
}
