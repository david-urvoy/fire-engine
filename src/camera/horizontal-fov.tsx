import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { MathUtils, PerspectiveCamera } from 'three'

export function HorizontalFov({ baseFov = 75 }: { baseFov?: number }) {
	const [camera, { width, height }] = useThree(({ camera, size }) => [camera, size] as const)

	useEffect(() => {
		if (!(camera instanceof PerspectiveCamera)) return

		const aspect = width / height
		const baseFovRad = MathUtils.degToRad(baseFov)
		const filmHeight = camera.getFilmHeight()
		const focalLength = (filmHeight * aspect) / (2 * Math.tan(baseFovRad / 2))

		camera.setFocalLength(focalLength)

		camera.updateProjectionMatrix()
	}, [camera, baseFov, width, height])

	return null
}
