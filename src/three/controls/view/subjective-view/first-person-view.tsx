import { PointerLockControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'
import { VERTICAL } from '../../../../game'
import { ControlledCharacter } from '../../use-player-controls'
import { useSubjectiveView } from './use-subjective-view'

/**
 * First person view
 */
export function FirstPersonView() {
	const { ref: target } = ControlledCharacter
	const pointerLockRef = useRef<PointerLockControlsImpl>(null)

	useSubjectiveView((camera) => {
		if (!target.current) return
		target.current.getWorldPosition(camera.position).add(VERTICAL)
	})

	useEffect(
		() => () => {
			document.exitPointerLock()
		},
		[],
	)

	return <PointerLockControls ref={pointerLockRef} selector="canvas" />
}
