import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { PerspectiveCamera } from 'three'

export function AdaptativeCamera() {
	const camera = useThree((state) => state.camera)

	useEffect(() => {
		const handleResize = () => {
			const aspect = window.innerWidth / window.innerHeight
			const newFov = Math.atan(Math.tan((75 * Math.PI) / 180 / 2) / aspect) * 2 * (180 / Math.PI)
			if (camera instanceof PerspectiveCamera) {
				camera.fov = newFov
				camera.updateProjectionMatrix()
			}
		}

		window.addEventListener('resize', handleResize)
		handleResize() // Call once to set initial FOV

		return () => window.removeEventListener('resize', handleResize)
	}, [camera])

	return null
}
