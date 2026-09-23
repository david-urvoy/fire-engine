import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

import { Tweaks, useAddBinding } from '../ui'

export function CameraTweak() {
	const { camera } = useThree()

	const cameraPos = useRef(camera.position)
	useAddBinding({
		folder: Tweaks.folder({ title: 'Debug' }),
		param: cameraPos,
		key: 'current',
		options: { label: 'camera' },
	})

	useFrame(Tweaks.refresh)

	return null
}
