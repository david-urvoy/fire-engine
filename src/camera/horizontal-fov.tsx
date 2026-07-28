import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { MathUtils, PerspectiveCamera } from 'three'

export function HorizontalFov({ baseFov = 75 }: { baseFov?: number }) {
	const [camera, { width, height }] = useThree(({ camera, size }) => [camera, size] as const)

	useEffect(() => {
		if (!(camera instanceof PerspectiveCamera)) return

		const aspect = width / height
		const baseFovRad = MathUtils.degToRad(baseFov)

		camera.fov = MathUtils.radToDeg(2 * Math.atan(Math.tan(baseFovRad / 2) / aspect))

		camera.updateProjectionMatrix()
	}, [camera, baseFov, width, height])

	return null
}
