import { proxy } from 'valtio'

export const pauseMenuStore = proxy({
	isActive: false,
	pause() {
		this.isActive = true
	},
	resume() {
		this.isActive = false
	},
})
