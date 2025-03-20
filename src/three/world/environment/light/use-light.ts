import { config, useSpring } from '@react-spring/three'
import { folder, useControls } from 'leva'
import { useSnapshot } from 'valtio'
import { gameTime } from '../../../../game'
import { PERIODS, type Period } from '../../../../game/time/period'
import type { Light } from './light'

export const useLight = ({
	folderName,
	lightProvider,
}: { folderName: string; lightProvider: (period: Period) => Light }) => {
	const { period } = useSnapshot(gameTime)
	const gamePeriod = PERIODS[period]
	const light = lightProvider(gamePeriod)

	const [, set] = useControls(
		'Debug',
		() => ({
			Lights: folder(
				{
					[folderName]: folder(
						{
							Intensity: {
								value: light.intensity,
								min: 0,
								max: 3,
								step: 0.1,
								onChange: (intensity) => api.set({ intensity }),
								transient: false,
							},
							Color: {
								value: light.color,
								onChange: (color) => api.set({ color }),
								transient: false,
							},
						},
						{ collapsed: true },
					),
				},
				{ collapsed: true },
			),
		}),
		{ collapsed: true, order: 100 },
		[folderName],
	)

	const [springs, api] = useSpring(
		{
			onRest: ({ value: { intensity, color } }) => set({ Intensity: intensity, Color: color }),
			config: config.molasses,
			...light,
		},
		[light],
	)

	return springs
}
