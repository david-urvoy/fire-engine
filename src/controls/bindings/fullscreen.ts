import { useEffect, type RefObject } from 'react'

import { game } from '../../game'

export function useEnableFullscreen(canvasRef: RefObject<HTMLCanvasElement | null>) {
	useEffect(() => {
		game.toggleFullscreen = () => {
			if (!document.fullscreenEnabled) return

			return !document.fullscreenElement
				? canvasRef.current?.requestFullscreen()
				: document.exitFullscreen()
		}
	}, [canvasRef])
}
