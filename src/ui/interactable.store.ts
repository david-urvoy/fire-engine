import { proxy } from 'valtio'

export const interactable = proxy({
	active: '',
	set(entityId: string) {
		this.active = entityId
	},
	clear() {
		this.active = ''
	},
})
