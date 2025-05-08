import { derive } from 'derive-valtio'
import { Vector2 } from 'three'
import { proxy, useSnapshot } from 'valtio'
import { game } from '../../../game'
import { ControlsType } from '../view/camera-view'

export const Keymap = {
	up: { keys: ['ArrowUp', 'KeyW'] },
	down: { keys: ['ArrowDown', 'KeyS'] },
	left: { keys: ['ArrowLeft', 'KeyA'] },
	right: { keys: ['ArrowRight', 'KeyD'] },
	shift: { keys: ['ShiftLeft'] },
	mobile: { keys: ['KeyM'] },
	meta: { keys: ['MetaLeft'] },
	alt: { keys: ['AltLeft'] },
	holoHud: { keys: ['KeyI'] },
	toggleDebug: {
		keys: ['KeyK'],
		action: () => {
			game.isDebug = !game.isDebug
		},
	},
	switchCameraType: {
		keys: ['KeyP'],
		action: () => {
			if (ControlsType.type === 'first-person') ControlsType.type = 'orbit'
			else ControlsType.type = 'first-person'
		},
	},
} as const

const direction = new Vector2()
export const base = proxy({
	state: Object.fromEntries(
		Object.keys(Keymap).map((key) => {
			return [key, false]
		}),
	) as Record<keyof typeof Keymap, boolean>,
})

function createMergedState<B, D>(base: B, derived: D): B & D {
	return proxy(Object.assign({}, base, derived))
}

const keyboardDirection = derive({
	direction: (get) => {
		const { up, down, right, left, shift } = get(base.state)
		const z = +up - +down
		const x = +left - +right
		const speed = (!shift ? 2 : 1) * 0.2
		return direction.set(x, z).multiplyScalar(speed)
	},
})

export const keyboard = createMergedState(base, keyboardDirection)

export function useKeyboardDirection() {
	return useSnapshot(keyboard).direction
}
