import { config, useSpring } from '@react-spring/three'
import { folder, useControls } from 'leva'
import type { Light } from 'three'
import { useSnapshot } from 'valtio'
import { gameTime } from '../../../../game'
import { PERIODS, type Period } from '../../../../game/time/period'

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
								onChange: (intensity) => {
									api.set({ intensity })
								},
								transient: false,
							},
							Color: {
								value: light.color,
								onChange: (color) => {
									api.set({ color })
								},
								options: { preset: 'colors' },
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
