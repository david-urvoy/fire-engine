import { proxy } from 'valtio'

import { pauseMenuStore } from './pause-menu/pause-menu.store'
import { playerMenuStore } from './player-menu/player-menu.store'

export const interfaceStore = proxy({
	playerMenu: playerMenuStore,
	pauseMenu: pauseMenuStore,
})
