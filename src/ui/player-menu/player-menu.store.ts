import { proxy } from 'valtio'

import { game } from '../../game'

export const playerMenuStore = proxy({
	isOpen: false,
	open() {
		playerMenuStore.isOpen = true
		game.pointerLock.ref.current?.unlock()
	},
	close() {
		playerMenuStore.isOpen = false
		game.pointerLock.ref.current?.lock()
	},
	toggle() {
		if (playerMenuStore.isOpen) playerMenuStore.close()
		else playerMenuStore.open()
	},
})
