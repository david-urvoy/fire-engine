import { useSnapshot } from 'valtio'
import { gameTime } from '../../../../game'
import { PERIODS, type Period } from '../../../../game/time/period'
import type { Light } from './light'

export const useLight = ({
	folderName,
	lightProvider,
}: { folderName: string; lightProvider: (period: Period) => Light }) => {
	const { period } = useSnapshot(gameTime)
	const light = lightProvider(PERIODS[period])

	// const [, set] = useControls(
	// 	'Debug',
	// 	() => ({
	// 		Lights: folder(
	// 			{
	// 				[folderName]: folder(
	// 					{
	// 						Intensity: {
	// 							value: light.intensity,
	// 							min: 0,
	// 							max: 3,
	// 							step: 0.1,
	// 							onChange: (intensity) => api.set({ intensity }),
	// 							transient: false,
	// 						},
	// 						Color: {
	// 							value: `#${light.color.getHexString()}`,
	// 							onChange: (color) => api.set({ color }),
	// 							transient: false,
	// 						},
	// 					},
	// 					{ collapsed: true },
	// 				),
	// 			},
	// 			{ collapsed: true },
	// 		),
	// 	}),
	// 	{ collapsed: true, order: 100 },
	// 	[folderName],
	// )

	// const [springs, api] = useSpring(
	// 	{
	// 		onRest: ({ value: { intensity, color } }) => set({ Intensity: intensity, Color: color }),
	// 		config: config.molasses,
	// 		...light,
	// 	},
	// 	[light],
	// )

	return
}
