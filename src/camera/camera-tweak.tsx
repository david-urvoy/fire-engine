import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
import { Vector3 } from 'three'

import { POSITION_EPSILON } from '../game'

export function CameraTweak() {
	const lastCameraPosition = useRef(new Vector3())
	const [_, set] = useControls(
		'🎥 Camera position',
		() => ({
			x: { value: 0, disabled: true },
			y: { value: 0, disabled: true },
			z: { value: 0, disabled: true },
		}),
		{
			collapsed: true,
		},
	)

	useFrame(({ camera }) => {
		if (lastCameraPosition.current.distanceTo(camera.position) > POSITION_EPSILON) {
			set(camera.position)
			lastCameraPosition.current.copy(camera.position)
		}
	})

	return null
}
