import { useEffect, useRef } from 'react'
import { PointerLockControls as ThreePLC } from 'three-stdlib'
import { game, GameRefs, useSubscribeKey } from '../../../game'

export function usePointerLock() {
	const controlsRef = useRef<ThreePLC>(null)
	const shouldMenuOpen = useRef(true)

	useSubscribeKey('KeyL', () => {
		if (game.uiMode === 'pause') return
		shouldMenuOpen.current = false
		controlsRef.current?.lock()
	})

	useSubscribeKey('KeyU', () => {
		if (game.uiMode !== 'gameplay') return
		game.uiMode = 'debug'
		shouldMenuOpen.current = false
		controlsRef.current?.unlock()
	})

	useEffect(() => {
		const handlePointerLockChange = () => {
			const locked = controlsRef.current?.isLocked

			if (locked) {
				game.uiMode = 'gameplay'

				shouldMenuOpen.current = true
				return
			}

			if (shouldMenuOpen.current) {
				game.pause()
			}
		}

		document.addEventListener('pointerlockchange', handlePointerLockChange)
		return () => {
			document.removeEventListener('pointerlockchange', handlePointerLockChange)
		}
	}, [])

	GameRefs.pointerLockControls.current = controlsRef.current

	return controlsRef
}
