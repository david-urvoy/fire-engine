import { PointerLockControls } from '@react-three/drei'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { game, POINTER_SPEED } from '../../../game'
import { TouchControls } from '../lock/touch-lock'
import { usePointerLock } from '../lock/usePointerLock'
import { CameraTracking } from './tracking'

function FirstPersonControls() {
	const { isMobile } = useSnapshot(game)
	const controlsRef = usePointerLock()

	if (isMobile) return <TouchControls />

	return <PointerLockControls ref={controlsRef} pointerSpeed={POINTER_SPEED} selector="#resume" />
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
