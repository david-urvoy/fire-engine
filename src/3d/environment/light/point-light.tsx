import { animated } from '@react-spring/three'
import { Helper } from '@react-three/drei'
import { PointLightHelper, type Color } from 'three'
import { useSnapshot } from 'valtio'

import { game } from '../../../game'
import { useLight } from './use-light'

export function PointLight({
	name,
	position,
	intensity: intensityInput,
	color: initialColor,
}: {
	name: string
	position?: [x: number, y: number, z: number]
	intensity: number
	color: Color
}) {
	const { debug } = useSnapshot(game)
	const { intensity, color } = useLight(
		`Point Light ${name}`,
		{ intensity: intensityInput, color: initialColor },
		{ min: 0, max: 1000, step: 10 },
	)

	return (
		<animated.pointLight position={position} intensity={intensity} color={color}>
			{debug.enabled && <Helper type={PointLightHelper} />}
		</animated.pointLight>
	)
}
