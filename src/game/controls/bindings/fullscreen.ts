import { game } from '../../game.store'

export function toggleFullscreen() {
	if (!document.fullscreenEnabled) return
	return !document.fullscreenElement
		? game.canvas.current?.requestFullscreen()
		: document.exitFullscreen()
}
