import { config, useSpring } from '@react-spring/three'
import { useCallback } from 'react'
import { Color } from 'three'
import { useSnapshot } from 'valtio'
import { gameTime } from '../../../../game'
import { PERIODS, type Period } from '../../../../game/time/period'
import { useTweaks } from '../../../../ui'
import type { Light } from './light'

export const useLight = ({ lightProvider }: { folderName: string; lightProvider: (period: Period) => Light }) => {
	const { period } = useSnapshot(gameTime)
	const light = lightProvider(PERIODS[period])

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

	useTweaks({
		folder: '💡 Lights',
		bindings: useCallback(
			(folder) => [
				folder
					.addBinding({ intensity: light.intensity }, 'intensity', { min: 0, max: 3, step: 0.1 })
					.on('change', ({ value: intensity }) => {
						api.start({ intensity })
					}),
				folder.addBinding({ color: light.color.getStyle() }, 'color').on('change', ({ value: color }) => {
					api.start({ color: new Color(color) })
				}),
			],
			[light, api],
		),
	})

	return springs
}
