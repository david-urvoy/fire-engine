import { type Vector3, useFrame } from '@react-three/fiber'
import { type PropsWithChildren, useState } from 'react'
import * as THREE from 'three'

export function Section({ position, children }: PropsWithChildren<{ position: Vector3 | undefined }>) {
	const [isLoaded, load] = useState(false)

	useFrame(({ camera }) => {
		if (position && Array.isArray(position)) {
			const distance = camera.position.distanceTo(new THREE.Vector3(position[0], position[1], position[2]))
			if (distance < 60 && !isLoaded) load(true)
			if (distance > 60 && isLoaded) load(false)
		}
	})

	return <>{isLoaded && <group position={position}>{children}</group>}</>
}
