import { animated } from '@react-spring/three'
import { Color } from 'three'
import { useLight } from './use-light'

export function AmbientLight() {
	const springs = useLight({
		folderName: 'Ambient Light',
		light: { color: new Color('#f3f37e'), intensity: 0.8 },
	})

	return <animated.ambientLight color={springs.color} intensity={springs.intensity} />
}
