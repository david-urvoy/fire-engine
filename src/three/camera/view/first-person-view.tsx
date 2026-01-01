import { PointerLockControls } from '@react-three/drei'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { game, POINTER_SPEED } from '../../../game'
import { TouchControls } from '../lock/touch-lock'
import { CameraTracking } from './tracking'

function FirstPersonControls() {
	const { isMobile } = useSnapshot(game)
	return isMobile ? (
		<TouchControls />
	) : (
		<PointerLockControls pointerSpeed={POINTER_SPEED} selector="canvas" makeDefault />
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
