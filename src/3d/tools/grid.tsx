import { Grid as DreiGrid } from '@react-three/drei'
import { useControls } from 'leva'
import { useSnapshot } from 'valtio'

import { game } from '../../game'

export function Grid() {
	const { enabled: isDebugEnabled } = useSnapshot(game.debug)

	const { sectionSize, sectionThickness, sectionColor, cellSize, cellThickness, cellColor } =
		useControls(
			'𖣯 Grid',
			{
				sectionSize: { value: 12, min: 2, max: 20, step: 2 },
				sectionThickness: { value: 1.5, min: 0.5, max: 5, step: 0.5 },
				sectionColor: '#9d4b4b',
				cellSize: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
				cellThickness: { value: 0.5, min: 0.1, max: 5, step: 0.1 },
				cellColor: '#6f6f6f',
			},
			{ collapsed: true },
		)

	return (
		<DreiGrid
			visible={isDebugEnabled}
			infiniteGrid
			followCamera
			sectionSize={sectionSize}
			sectionColor={sectionColor}
			sectionThickness={sectionThickness}
			cellColor={cellColor}
			cellThickness={cellThickness}
			cellSize={cellSize}
			fadeDistance={25}
			fadeStrength={1}
		/>
	)
}
