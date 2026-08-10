import { PointerLockControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { Quaternion, Vector3 } from 'three'
import { useSnapshot } from 'valtio'

import { dialogueStore, game, POINTER_SPEED, useGame } from '../../game'
import { DialogueEventBlocker } from '../../ui'
import { TouchControls } from '../lock/touch-lock'
import { usePointerLock } from '../lock/usePointerLock'

const Y_AXIS = new Vector3(0, 1, 0)
const _tmpDir = new Vector3()
const _tmpQuat = new Quaternion()

function FirstPersonControls() {
	const { camera } = useThree()
	const {
		responsive: { isMobile },
		isPaused,
	} = useSnapshot(game)
	const { active: dialogue } = useSnapshot(dialogueStore)
	const controlsRef = usePointerLock()
	const { entityManager } = useGame()

	if (isMobile) return <TouchControls />

	return (
		<PointerLockControls
			ref={controlsRef}
			onLock={() => (game.pointerLock.isLocked = true)}
			onUnlock={() => (game.pointerLock.isLocked = false)}
			onChange={() => {
				const entity = entityManager.get(game.controlledCharacter)
				if (!entity) return

				entity.runtime.rigidBody.current?.wakeUp()

				camera.getWorldDirection(_tmpDir)
				const x = -_tmpDir.x
				const z = -_tmpDir.z
				if (x !== 0 || z !== 0) {
					const yaw = Math.atan2(x, z)
					_tmpQuat.setFromAxisAngle(Y_AXIS, yaw)
					entity.physic.orientation.copy(_tmpQuat)
				}
			}}
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
