import { useControls } from 'leva'
import { Color } from 'three'

import type { Light } from './light'

export const useLight = ({ light }: { folderName: string; light: Light }) => {
	const { intensity, color } = useControls(
		'💡 Light',
		{
			intensity: { value: light.intensity, min: 0, max: 3, step: 0.1 },
			color: light.color.getStyle(),
		},
		{ collapsed: true },
	)

	return { color: new Color(color), intensity }
}
