import { proxy } from 'valtio'

import { game } from '../../game'

export const gameMenu = proxy({
	isOpen: false,
	open() {
		gameMenu.isOpen = true
		game.pointerLock.ref.current?.unlock()
	},
	close() {
		gameMenu.isOpen = false
		game.pointerLock.ref.current?.lock()
	},
	toggle() {
		if (gameMenu.isOpen) gameMenu.close()
		else gameMenu.open()
	},
})
