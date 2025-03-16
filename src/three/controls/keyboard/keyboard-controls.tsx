import { type PropsWithChildren, useCallback, useEffect } from 'react'
import { keyboard } from './keymap'

export function KeyboardControls({ map: keymap, children }: PropsWithChildren & { map: Record<string, string[]> }) {
	const toggleKey = useCallback(
		(code: string, value: boolean) => {
			const obj = Object.entries(keymap).find(([_, keyCodes]) => keyCodes.includes(code))
			if (!obj) return
			keyboard.state[obj[0] as keyof typeof keyboard.state] = value
		},
		[keymap],
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
