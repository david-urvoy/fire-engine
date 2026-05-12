import { type PropsWithChildren, useCallback, useEffect } from 'react'
import { game } from '../../../game/game.store'
import { useKeyboardActions } from './keyboard-actions'
import { keyboardKeys } from './keyboard.store'
import { KEYBOARD_CODE_TO_ACTION, type Keymap } from './keymap'

export function KeyboardControls({
	map: _keymap,
	children,
}: PropsWithChildren & { map: typeof Keymap }) {
	const keyboardActions = useKeyboardActions()

	const toggleKey = useCallback(
		(code: string, value: boolean) => {
			const found = KEYBOARD_CODE_TO_ACTION[code]
			if (!found) return

			const { category, action: command } = found

			if (game.isDialogueLocked) {
				if (value && category === 'dialogue') keyboardActions[command]?.()
				return
			}

			keyboardKeys[command] = value
			if (value) keyboardActions[command]?.()
		},
		[keyboardActions],
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
