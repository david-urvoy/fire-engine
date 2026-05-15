import { type PropsWithChildren, useCallback, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { dialogueStore } from '../../../game/conversation/dialogue/dialogue.store'
import { useKeyboardActions } from './keyboard-actions'
import { keyboardKeys, resetKeyboardKeys } from './keyboard.store'
import { KEYBOARD_CODE_TO_ACTION, type Keymap } from './keymap'

export function KeyboardControls({
	map: _keymap,
	children,
}: PropsWithChildren & { map: typeof Keymap }) {
	const { active: activeDialogue } = useSnapshot(dialogueStore)
	const isDialogueLocked = !!activeDialogue?.locked
	const keyboardActions = useKeyboardActions()

	const toggleKey = useCallback(
		(code: string, value: boolean) => {
			const found = KEYBOARD_CODE_TO_ACTION[code]
			if (!found) return

			const { category, action: command } = found

			if (dialogueStore.active?.locked) {
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

		const blurHandler = () => {
			resetKeyboardKeys()
		}

		window.addEventListener('keydown', downHandler as EventListenerOrEventListenerObject, {
			passive: true,
			signal: keysSubscriptionController.signal,
		})
		window.addEventListener('keyup', upHandler as EventListenerOrEventListenerObject, {
			passive: true,
			signal: keysSubscriptionController.signal,
		})
		window.addEventListener('blur', blurHandler as EventListenerOrEventListenerObject, {
			passive: true,
			signal: keysSubscriptionController.signal,
		})

		return () => keysSubscriptionController.abort()
	}, [downHandler, upHandler])

	useEffect(() => {
		if (!isDialogueLocked) return
		resetKeyboardKeys()
	}, [isDialogueLocked])

	return children
}
