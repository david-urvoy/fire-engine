import { useEffect } from 'react'
import type { PointerLockControls } from 'three-stdlib'
import { game } from '../../game.store'

let controls: PointerLockControls | null = null

export function useRegisterPointerLockControls(ref: React.RefObject<PointerLockControls | null>) {
	useEffect(() => {
		if (ref.current) {
			controls = ref.current
		}
	}, [ref])
}

export function resumeGame() {
	controls?.lock()
}

export function pauseGame() {
	controls?.unlock()
}

export function togglePauseGame() {
	if (game.isPaused) {
		resumeGame()
	} else {
		pauseGame()
	}
}
