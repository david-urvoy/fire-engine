import { proxy } from 'valtio'

export const hudSize = 200

export const hud = proxy({
	isVisible: false,
	toggle() {
		hud.isVisible = !hud.isVisible
	},
	setVisible(visible: boolean) {
		hud.isVisible = visible
	},
	hide() {
		hud.setVisible(false)
	},
})
