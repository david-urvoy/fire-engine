import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { PointerLock } from '../../mouse/pointer-lock'
import { ControlledCharacter } from '../../use-player-controls'
import { useSubjectiveView } from './use-subjective-view'

/**
 * Third person view
 */
const targetPosition = new Vector3()
export function ThirdPersonView() {
	const orbit = useRef<OrbitControlsImpl>(null)
	const { ref: target } = ControlledCharacter

	useSubjectiveView((camera) => {
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
