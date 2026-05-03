import { PointerLockControls } from '@react-three/drei'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { game, POINTER_SPEED } from '../../game'
import { DialogueEventBlocker } from '../../ui'
import { TouchControls } from '../lock/touch-lock'
import { usePointerLock } from '../lock/usePointerLock'
import { CameraOrientation, CameraTracking } from './tracking'

function FirstPersonControls() {
	const { isMobile, uiMode, dialogue } = useSnapshot(game)
	const controlsRef = usePointerLock()

	if (isMobile) return <TouchControls />

	return (
		<PointerLockControls
			ref={controlsRef}
			pointerSpeed={POINTER_SPEED}
			selector={uiMode === 'pause' ? '#resume' : dialogue.active?.line ? '#none' : 'canvas'}
		/>
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
			<CameraOrientation />
			<FirstPersonControls />
			<DialogueEventBlocker />
		</>
	)
}
