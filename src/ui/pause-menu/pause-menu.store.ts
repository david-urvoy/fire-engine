import { game } from '../../game'

export const pauseMenu = {
	isPaused: false,
	pause() {
		game.isPaused = true
	},
	resume() {
		game.isPaused = false
	},
}
