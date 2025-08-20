import { config, useSpring } from '@react-spring/three'
import { useEffect } from 'react'
import { Color } from 'three'
import { useTweaks } from '../../../../ui'
import type { Light } from './light'

export const useLight = ({ light }: { folderName: string; light: Light }) => {
	const [springs, api] = useSpring(
		{
			onRest: ({ value: { intensity, color } }) => {
				return { Intensity: intensity, Color: color }
			},
			config: config.molasses,
			...light,
		},
		[light],
	)

	const tweaks = useTweaks({ title: '💡 Lights' })
	const intensity = tweaks
		.addBinding<number>({ params: [{ intensity: light.intensity }, 'intensity', { min: 0, max: 3, step: 0.1 }] })
	const [color] = tweaks
		.addBinding<string>({ params: [{ color: light.color.getStyle() }, 'color'] })

	useEffect(() => {
		return () => {
			api.start({ color: new Color(color), intensity })
		}
	}, [api, color, intensity])

	return springs
}
