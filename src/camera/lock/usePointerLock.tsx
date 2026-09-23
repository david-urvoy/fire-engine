import { useEffect, useRef } from 'react'
import { PointerLockControls as ThreePLC } from 'three-stdlib'
import { useSnapshot } from 'valtio'

import { game } from '../../game'

export function usePointerLock() {
	const controlsRef = useRef<ThreePLC>(null)
	const { isPaused } = useSnapshot(game)

	useEffect(() => {
		if (isPaused) controlsRef.current?.unlock()
	}, [isPaused])

	useEffect(() => {
		game.pointerLock.ref.current = controlsRef.current
		const ref = game.pointerLock.ref

		return () => {
			ref.current = null
		}
	}, [controlsRef])

	return controlsRef
}
