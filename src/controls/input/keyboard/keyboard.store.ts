import { Vector2 } from 'three'
import { proxy, useSnapshot } from 'valtio'
import { computed } from 'valtio-reactive'

import { type Action, Keymap } from './keymap'

const _dir = new Vector2()

export const keyboardKeys = proxy(
	Object.fromEntries(
		(Object.values(Keymap) as Record<string, readonly string[]>[])
			.flatMap((category) => Object.keys(category))
			.map((k) => [k, false]),
	) as Record<Action, boolean>,
)

const keyboardCommands = computed({
	direction: () => {
		const { up, down, left, right, sprint } = keyboardKeys
		const z = -up + +down
		const x = -left + +right
		const speed = (!sprint ? 2 : 1) * 0.2
		return _dir.set(x, z).multiplyScalar(speed)
	},
})

export function useKeyboard() {
	const keys = useSnapshot(keyboardKeys)
	const direction = useKeyboardDirection()
	return { ...keys, direction }
}

export function useKeyboardDirection() {
	const commands = useSnapshot(keyboardCommands)
	return commands.direction
}

export function resetKeyboardKeys() {
	for (const action of Object.keys(keyboardKeys) as Action[]) {
		keyboardKeys[action] = false
	}
}
