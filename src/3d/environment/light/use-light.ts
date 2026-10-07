import { folder, useControls } from 'leva'
import { Color } from 'three'

import type { Light } from './light.model'

export const useLight = (
	name: string,
	{ color: colorInput, intensity: intensityInput }: Light,
	{ min, max, step }: { min: number; max: number; step: number },
) => {
	const { intensity, color, helper } = useControls(
		'💡 Light',
		{
			[name]: folder({
				intensity: { value: intensityInput, min, max, step },
				color: colorInput.getStyle(),
				helper: false,
			}),
		},
		{ collapsed: true },
	)

	return { color: new Color(color), intensity, helper }
}
