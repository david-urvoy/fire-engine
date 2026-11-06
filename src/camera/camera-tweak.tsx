import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { useSnapshot } from 'valtio'

import { game, POSITION_EPSILON } from '../game'

export function CameraTweak() {
	const { camera: cameraStore } = useSnapshot(game)
	const position = useRef(new Vector3())

	useFrame(({ camera }) => {
		if (position.current.distanceTo(camera.position) > POSITION_EPSILON) {
			game.camera.position.x = camera.position.x
			game.camera.position.y = camera.position.y
			game.camera.position.z = camera.position.z
		}

		position.current.copy(cameraStore.position)
	})

	return <></>
}
