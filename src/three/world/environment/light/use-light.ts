import { Color } from 'three'
import { Tweaks, useAddBinding } from '../../../../ui'
import type { Light } from './light'

export const useLight = ({ light }: { folderName: string; light: Light }) => {
	const folder = Tweaks.folder({ title: '💡 Lights' })
	const { intensity } = useAddBinding({
		folder,
		param: { intensity: light.intensity },
		options: { min: 0, max: 3, step: 0.1 }
	})
	const { color } = useAddBinding({
		folder,
		param: { color: light.color.getStyle() }
	})

	return { color: new Color(color), intensity }
}
