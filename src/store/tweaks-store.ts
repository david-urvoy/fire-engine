import { proxy } from 'valtio'
import { game } from './game-store'

export const tweaks = proxy({
	isDebug: game.isDebug,
})
