import { useFrame } from '@react-three/fiber'
import { type PropsWithChildren, useRef } from 'react'
import type { Vector3 } from 'three'

function isInRange(subjectPosition: Vector3, targetPosition: Vector3, range: number) {
	return targetPosition.distanceTo(subjectPosition) < range
}

export function Section({
	position,
	maxDistance = 60,
	children,
}: PropsWithChildren<{ position: Vector3; maxDistance?: number }>) {
	const isLoaded = useRef(false)
	const isVisible = useRef(false)

	useFrame(({ camera }) => {
		const inRange = isInRange(position, camera.position, maxDistance)
		if (inRange) {
			isLoaded.current = true
			isVisible.current = true
			return
		}

		isVisible.current = false
	})

	return (
		isLoaded && (
			<group visible={isVisible.current} position={position}>
				{children}
			</group>
		)
	)
}
