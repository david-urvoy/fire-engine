import { Grid as DreiGrid } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import { game } from '../../game'
import { Tweaks, useAddBindings } from '../../ui'

export function Grid() {
	const { isDebug } = useSnapshot(game)

	const folder = Tweaks.folder({ title: 'Debug' }).folder({ title: '𖣯 Grid' })
	const test = useAddBindings({
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
			visible={isDebug}
			infiniteGrid
			followCamera
			sectionSize={test[0].sectionSize}
			sectionColor={test[2].sectionColor}
			sectionThickness={test[1].sectionThickness}
			cellColor={test[5].cellColor}
			cellThickness={test[4].cellThickness}
			cellSize={test[3].cellSize}
			fadeDistance={25}
			fadeStrength={1}
		/>
	)
}
