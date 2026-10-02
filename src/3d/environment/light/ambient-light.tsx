import { animated } from '@react-spring/three'
import { Color } from 'three'

import { useLight } from './use-light'

export function AmbientLight({
	color = new Color('#fcfcfc'),
	intensity = 1,
}: {
	color?: Color
	intensity?: number
}) {
	const springs = useLight('Ambient Light', { color, intensity }, { min: 0, max: 2, step: 0.1 })

	return <animated.ambientLight color={springs.color} intensity={springs.intensity} />
}
