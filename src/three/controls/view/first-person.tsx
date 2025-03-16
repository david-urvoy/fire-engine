import { PointerLockControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'
import { VERTICAL } from '../../../game'
import { CameraTarget } from '../../camera/camera-target'
import { useCameraTracking } from './use-controls'

export function FirstPersonView() {
	const { ref: target } = CameraTarget
	const controlsRef = useRef<PointerLockControlsImpl>(null)
	useCameraTracking()

	useFrame(({ camera }) => {
		if (!target.current || !controlsRef.current) return
		target.current.getWorldPosition(camera.position).add(VERTICAL)
	})

	return <PointerLockControls ref={controlsRef} />
}
