import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { PointerLock } from '../lock/pointer-lock'
import { CameraTracking } from './tracking'

export function ThirdPersonView() {
	const target = useRef(new Vector3())
	const orbit = useRef<OrbitControlsImpl>(null)

	useFrame(function cameraFollowsTargetPosition() {
		if (!orbit.current) return
		orbit.current.target.copy(target.current)
	})

	return (
		<>
			<CameraTracking target={target} />
			<PointerLock controls={orbit} />
			<OrbitControls
				ref={orbit}
				minDistance={2}
				maxDistance={6}
				enableDamping={false}
				makeDefault
			/>
		</>
	)
}
