import { PointerLockControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'
import { ControlledCharacter } from '../../../game/controls/controls'
import { useSubjectiveView } from './use-subjective-view'

/**
 * First person view
 */
export function FirstPersonView() {
	const { ref: target } = ControlledCharacter
	const pointerLockRef = useRef<PointerLockControlsImpl>(null)

	useSubjectiveView((camera) => {
		if (!target.current) return
		target.current.getWorldPosition(camera.position)
	})

	useEffect(
		() => () => {
			document.exitPointerLock()
		},
		[],
	)

	return <PointerLockControls ref={pointerLockRef} selector="canvas" />
}
