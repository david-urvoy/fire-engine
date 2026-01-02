import { Vector2 } from 'three'
import { proxy, useSnapshot } from 'valtio'
import { computed } from 'valtio-reactive'
import { Keymap } from './keymap'

const _dir = new Vector2()

export const keyboardKeys = proxy(
	Object.fromEntries(Object.keys(Keymap).map((k) => [k, false])) as Record<
		keyof typeof Keymap,
		boolean
	>,
)

const keyboardCommands = computed({
	direction: () => {
		const { up, down, left, right, shift } = keyboardKeys
		const z = +up - +down
		const x = +left - +right
		const speed = (!shift ? 2 : 1) * 0.2
		return _dir.set(x, z).multiplyScalar(speed)
	},
})

export function useKeyboard() {
	const keys = useSnapshot(keyboardKeys)
	const commands = useSnapshot(keyboardCommands)
	return { ...keys, direction: commands.direction }
}
