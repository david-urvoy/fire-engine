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
		const { up, down, left, right } = keyboardKeys
		const z = -up + +down
		const x = -left + +right
		return _dir.clone().set(x, z)
	},
	speed: () => {
		const { sprint } = keyboardKeys
		return !sprint ? 4 : 1.5
	},
})

export function useKeyboard() {
	return useSnapshot(keyboardKeys)
}

export function useKeyboardMovement(): [Vector2, number] {
	const commands = useSnapshot(keyboardCommands)
	return [commands.direction, commands.speed] as const
}

export function resetKeyboardKeys() {
	for (const action of Object.keys(keyboardKeys) as Action[]) {
		keyboardKeys[action] = false
	}
}
