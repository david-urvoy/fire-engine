import { proxy } from 'valtio'

import { game } from '../../game'

export const gameInterface = proxy({
	isOpen: false,
	open() {
		gameInterface.isOpen = true
		game.pointerLock.ref.current?.unlock()
	},
	close() {
		gameInterface.isOpen = false
		game.pointerLock.ref.current?.lock()
	},
	toggle() {
		if (gameInterface.isOpen) gameInterface.close()
		else gameInterface.open()
	},
})
