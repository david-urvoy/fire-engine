import { PointerLockControls } from '@react-three/drei'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { dialogueStore, game, POINTER_SPEED, useGame } from '../../game'
import { DialogueEventBlocker } from '../../ui'
import { TouchControls } from '../lock/touch-lock'
import { usePointerLock } from '../lock/usePointerLock'

function FirstPersonControls() {
	const { isMobile, isPaused } = useSnapshot(game)
	const { active: dialogue } = useSnapshot(dialogueStore)
	const controlsRef = usePointerLock()
	const { entityManager } = useGame()

	if (isMobile) return <TouchControls />

	return (
		<PointerLockControls
			ref={controlsRef}
			onLock={() => (game.isPointerLocked = true)}
			onUnlock={() => (game.isPointerLocked = false)}
			onChange={() => entityManager.get(game.controlledCharacter)?.runtime?.rigidBody?.wakeUp()}
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
