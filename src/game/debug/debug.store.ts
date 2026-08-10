import { proxy } from 'valtio'

export const debugStore = proxy({
	enabled: false,
	toggle() {
		debugStore.enabled = !debugStore.enabled
	},
	value: {} as any,
})
