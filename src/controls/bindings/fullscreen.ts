import { useContext } from 'react'
import { AppContext } from '../../lib'

export function useToggleFullscreen() {
	const { canvasRef } = useContext(AppContext)

	return () => {
		if (!document.fullscreenEnabled) return

		return !document.fullscreenElement
			? canvasRef.current?.requestFullscreen()
			: document.exitFullscreen()
	}
}
