import { proxy } from 'valtio'

export const audioStore = proxy({
	music: {
		volume: 0,
	},
	soundEffects: {
		volume: 20,
	},
	voices: {
		volume: 20,
		distance: 0.5,
	},
	isMuted: true,
})
