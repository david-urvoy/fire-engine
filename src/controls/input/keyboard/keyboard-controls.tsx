import { type PropsWithChildren, useCallback, useEffect } from 'react'
import { useKeyboardActions } from './keyboard-actions'
import { keyboardKeys } from './keyboard.store'
import type { Keymap } from './keymap'

export function KeyboardControls({
	map: keymap,
	children,
}: PropsWithChildren & { map: typeof Keymap }) {
	const keyboardActions = useKeyboardActions()

	const toggleKey = useCallback(
		(code: string, value: boolean) => {
			const obj = Object.entries(keymap).find(([, keys]: [string, readonly string[]]) =>
				keys.includes(code),
			)

			if (!obj) return

			const command = obj[0] as keyof typeof keymap
			keyboardKeys[command] = value
			if (value) keyboardActions[command]?.()
		},
		[keymap, keyboardActions],
	)

	const downHandler = useCallback(
		({ code, repeat }: KeyboardEvent) => {
			if (repeat) return
			toggleKey(code, true)
		},
		[toggleKey],
	)

	const upHandler = useCallback(
		({ code }: KeyboardEvent) => {
			toggleKey(code, false)
		},
		[toggleKey],
	)

	useEffect(() => {
		const keysSubscriptionController = new AbortController()
		window.addEventListener('keydown', downHandler as EventListenerOrEventListenerObject, {
			passive: true,
			signal: keysSubscriptionController.signal,
		})
		window.addEventListener('keyup', upHandler as EventListenerOrEventListenerObject, {
			passive: true,
			signal: keysSubscriptionController.signal,
		})

		return () => keysSubscriptionController.abort()
	}, [downHandler, upHandler])

	return children
}
