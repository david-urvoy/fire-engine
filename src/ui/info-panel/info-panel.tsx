import { useSnapshot } from 'valtio'

import { game } from '../../game'
import { infoPanelStore } from './info-panel.store'

export function InfoPanel() {
	const { content } = useSnapshot(infoPanelStore)

	if (!content) return null

	return (
		<div className="z-500 flex h-full w-full items-center justify-center">
			<div
				className="pointer-events-auto mx-4 min-h-28 w-full flex-col rounded-2xl border-2 border-cyan-900 bg-cyan-700 p-4 text-center"
				onClick={() => game.interface.infoPanel.clear()}
			>
				{content}
			</div>
		</div>
	)
}
