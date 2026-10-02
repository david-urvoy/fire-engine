import { folder, useControls } from 'leva'
import { Color } from 'three'

import type { Light } from './light.model'

export const useLight = (
	name: string,
	{ color: colorInput, intensity: intensityInput }: Light,
	{ min, max, step }: { min: number; max: number; step: number },
) => {
	const { intensity, color } = useControls(
		'💡 Light',
		{
			[name]: folder({
				intensity: { value: intensityInput, min, max, step },
				color: colorInput.getStyle(),
			}),
		},
		{ collapsed: true },
	)

	return { color: new Color(color), intensity }
}
