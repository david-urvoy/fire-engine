import { PointerLockControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { ControlledCharacter, game } from '../..'
import { useCameraFollowsTargetOrientation, useCharacterMove } from '../controls'
import { TouchControls } from './lock/touch-lock'

/**
 * First person view
 */
export function FirstPersonView() {
	const { isMobile } = useSnapshot(game)

	useEffect(
		() => () => {
			document.exitPointerLock()
		},
		[],
	)

	useCameraFollowsTargetOrientation()
	useCharacterMove()

	useFrame(function cameraFollowsTargetPosition({ camera }) {
		ControlledCharacter.ref.current?.getWorldPosition(camera.position)
	})

	return isMobile ? <TouchControls /> : <PointerLockControls />
}
