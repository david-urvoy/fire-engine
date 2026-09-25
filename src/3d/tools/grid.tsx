import { Grid as DreiGrid } from '@react-three/drei'
import { useSnapshot } from 'valtio'

import { game } from '../../game'
import { Tweaks, useAddBindings } from '../../ui'

export function Grid() {
	const { enabled: isDebugEnabled } = useSnapshot(game.debug)

	const folder = Tweaks.folder({ title: 'Debug' }).folder({ title: '𖣯 Grid', expanded: false })
	const { sectionSize, sectionColor, sectionThickness, cellColor, cellThickness, cellSize } =
		useAddBindings({
			folder,
			bindings: [
				{ param: { sectionSize: 12 }, options: { min: 2, max: 20, step: 2 } },
				{ param: { sectionThickness: 1.5 }, options: { min: 0.5, max: 5, step: 0.5 } },
				{ param: { sectionColor: '#9d4b4b' } },
				{ param: { cellSize: 0.5 }, options: { min: 0.1, max: 2, step: 0.1 } },
				{ param: { cellThickness: 0.5 }, options: { min: 0.1, max: 5, step: 0.1 } },
				{ param: { cellColor: '#6f6f6f' } },
			],
		})

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
