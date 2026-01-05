import { GameRefs } from '../../game.store'

export function toggleFullscreen() {
	if (!document.fullscreenEnabled) return

	return !document.fullscreenElement
		? GameRefs.canvas.current?.requestFullscreen()
		: document.exitFullscreen()
}
