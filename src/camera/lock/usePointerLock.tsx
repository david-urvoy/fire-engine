import { useRef } from 'react'
import { PointerLockControls as ThreePLC } from 'three-stdlib'
import { useSnapshot } from 'valtio'
import { useSubscribeKey } from '../../controls'
import { game } from '../../game'

export function usePointerLock() {
	const controlsRef = useRef<ThreePLC>(null)
	const { isPaused } = useSnapshot(game)

	useSubscribeKey('KeyL', () => {
		if (game.uiMode === 'pause') return
		controlsRef.current?.lock()
	})

	if (isPaused) controlsRef.current?.unlock()

	game.pointerLockControls.current = controlsRef.current

	return controlsRef
}
