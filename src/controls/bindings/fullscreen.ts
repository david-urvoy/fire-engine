import { useGame } from '../../game'

export function useToggleFullscreen() {
	const { canvasRef } = useGame()

	return () => {
		if (!document.fullscreenEnabled) return

		return !document.fullscreenElement
			? canvasRef.current?.requestFullscreen()
			: document.exitFullscreen()
	}
}
