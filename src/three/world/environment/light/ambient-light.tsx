import { animated } from '@react-spring/three'
import { useLight } from './use-light'

export function AmbientLight() {
	const springs = useLight({
		folderName: 'Ambient Light',
		lightProvider: (period) => period.light.ambient,
	})

	return <animated.ambientLight color={springs.color} intensity={springs.intensity} />
}
