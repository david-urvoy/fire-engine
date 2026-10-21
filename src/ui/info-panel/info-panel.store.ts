import { proxy } from 'valtio'

import { game } from '../../game'

export const infoPanelStore = proxy({
	content: null as string | null,
	set(content: string) {
		infoPanelStore.content = content
		game.pointer.unlock()
	},
	clear() {
		infoPanelStore.content = null
		game.pointer.lock()
	},
})
