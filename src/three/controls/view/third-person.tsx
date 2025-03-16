import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { CameraTarget } from '../../camera/camera-target'
import { PointerLock } from '../mouse/pointer-lock'
import { useCameraTracking } from './use-controls'

const targetPosition = new Vector3()

export function ThirdPersonView() {
	const orbit = useRef<OrbitControlsImpl>(null)
	const { ref: target } = CameraTarget

	useCameraTracking()

	useFrame(({ camera }) => {
		if (!target.current || !orbit.current) return

		camera.position.sub(targetPosition).add(target.current.getWorldPosition(targetPosition))
		orbit.current.target.copy(targetPosition)
	})

	return (
		<PointerLock controls={orbit}>
			<OrbitControls ref={orbit} minDistance={2} maxDistance={6} makeDefault />
		</PointerLock>
	)
}
