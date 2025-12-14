import { derive } from 'derive-valtio'
import { Vector2 } from 'three'
import { proxy } from 'valtio'
import { Keymap } from './keymap'

const direction = new Vector2()

const keyboardBase = proxy({
	state: Object.fromEntries(Object.keys(Keymap).map((key) => [key, false])) as Record<
		keyof typeof Keymap,
		boolean
	>,
})

export const keyboard = derive(
	{
		direction: (get) => {
			const { up, down, right, left, shift } = get(keyboardBase).state
			const z = +up - +down
			const x = +left - +right
			const speed = (!shift ? 2 : 1) * 0.2
			return direction.set(x, z).multiplyScalar(speed)
		},
	},
	{ proxy: keyboardBase },
)
