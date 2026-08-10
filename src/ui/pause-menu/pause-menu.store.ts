import { proxy } from 'valtio'

export const pauseMenu = proxy({
	isPaused: false,
	pause() {
		this.isPaused = true
	},
	resume() {
		this.isPaused = false
	},
})
