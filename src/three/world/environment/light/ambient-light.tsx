import { Color } from 'three'
import { useLight } from './use-light'

export function AmbientLight({
	color = new Color('#fcfcfc'),
	intensity = 0.1,
}: {
	color?: Color
	intensity?: number
}) {
	const springs = useLight({
		folderName: 'Ambient Light',
		light: { color, intensity },
	})

	return <ambientLight color={springs.color} intensity={springs.intensity} />
}
