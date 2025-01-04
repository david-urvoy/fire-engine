import { Hud as DreiHud, PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { type AxesHelper, Matrix4 } from 'three'

const matrix = new Matrix4()

export function Hud({ renderPriority = 1 }) {
	const { camera } = useThree()
	const axesHelper = useRef<AxesHelper>(null)

	useFrame(({ viewport }) => {
		matrix.copy(camera.matrix).invert()
		axesHelper.current?.quaternion.setFromRotationMatrix(matrix)
		axesHelper.current?.position.set(viewport.width / 2, -viewport.height / 2, 0)
	})

	return (
		<DreiHud renderPriority={renderPriority}>
			<PerspectiveCamera makeDefault position={[0, 0, 10]} />
			<axesHelper ref={axesHelper} />
		</DreiHud>
	)
}
