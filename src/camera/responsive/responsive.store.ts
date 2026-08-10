import { proxy } from 'valtio'

export const responsiveStore = proxy({
	isMobile: typeof window !== 'undefined' && 'ontouchstart' in window,
	toggle() {
		this.isMobile = !this.isMobile
	},
})
