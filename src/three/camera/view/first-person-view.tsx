import { PointerLockControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { PointerLockControls as ThreePLC } from 'three-stdlib'
import { useSnapshot } from 'valtio'
import { game, POINTER_SPEED } from '../../../game'
import { useRegisterPointerLockControls } from '../../../game/controls/bindings/pause'
import { TouchControls } from '../lock/touch-lock'
import { CameraTracking } from './tracking'

function FirstPersonControls() {
	const { isMobile } = useSnapshot(game)
	const controlsRef = useRef<ThreePLC>(null)

	useRegisterPointerLockControls(controlsRef)

	useEffect(() => {
		const handlePointerLockChange = () => {
			const locked = document.pointerLockElement !== null

			if (locked && game.isPaused) {
				game.isPaused = false
			}

			if (!locked && !game.isPaused) {
				game.isPaused = true
			}
		}
		document.addEventListener('pointerlockchange', handlePointerLockChange)
		return () => document.removeEventListener('pointerlockchange', handlePointerLockChange)
	}, [])

	return isMobile ? (
		<TouchControls />
	) : (
		<PointerLockControls ref={controlsRef} pointerSpeed={POINTER_SPEED} selector="#resume" />
	)
}

/**
 * First person view
 */
export function FirstPersonView() {
	useEffect(() => () => document.exitPointerLock(), [])

	return (
		<>
			<CameraTracking />
			<FirstPersonControls />
		</>
	)
}
