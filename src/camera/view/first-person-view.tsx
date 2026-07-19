import { PointerLockControls } from '@react-three/drei'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { dialogueStore, game, POINTER_SPEED } from '../../game'
import { DialogueEventBlocker } from '../../ui'
import { TouchControls } from '../lock/touch-lock'
import { usePointerLock } from '../lock/usePointerLock'

function FirstPersonControls() {
	const { isMobile, isPaused } = useSnapshot(game)
	const { active: dialogue } = useSnapshot(dialogueStore)
	const controlsRef = usePointerLock()

	if (isMobile) return <TouchControls />

	return (
		<PointerLockControls
			ref={controlsRef}
			onLock={() => (game.isPointerLocked = true)}
			onUnlock={() => (game.isPointerLocked = false)}
			pointerSpeed={POINTER_SPEED}
			selector={isPaused ? '#resume' : dialogue?.awaitingChoice ? '#none' : 'canvas'}
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
			<FirstPersonControls />
			<DialogueEventBlocker />
		</>
	)
}
