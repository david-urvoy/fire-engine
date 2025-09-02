import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { ControlledCharacter, useCameraFollowsTargetOrientation, useCharacterMove } from '../../../game/controls/controls'
import { usePointerLock } from './lock/pointer-lock'

const targetPosition = new Vector3()

export function ThirdPersonView() {
	const orbit = useRef<OrbitControlsImpl>(null)

	usePointerLock(orbit)

	useCharacterMove()
	useCameraFollowsTargetOrientation()

	useFrame(function cameraFollowsTargetPosition({ camera }) {
		if (!ControlledCharacter.ref.current || !orbit.current) return
		camera.position.sub(targetPosition).add(ControlledCharacter.ref.current.getWorldPosition(targetPosition))
		orbit.current.target.copy(targetPosition)
	})

	return <OrbitControls ref={orbit} minDistance={2} maxDistance={6} enableDamping={false} makeDefault />
}
