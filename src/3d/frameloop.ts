import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { game } from '../game'

export function useFrameloop() {
	const { invalidate, gl, scene, camera } = useThree()

	useEffect(() => {
		if (game.isPaused) gl.setAnimationLoop(null)
		else gl.setAnimationLoop(() => gl.render(scene, camera))
	}, [gl, invalidate, scene, camera])
}
