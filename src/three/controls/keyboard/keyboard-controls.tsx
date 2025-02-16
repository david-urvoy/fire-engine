import { type PropsWithChildren, useCallback, useEffect } from 'react'
import { Vector2 } from 'three'
import { proxy, useSnapshot } from 'valtio'
import { game } from '../../../game'

export const Keymap = {
	up: ['ArrowUp', 'KeyW'],
	down: ['ArrowDown', 'KeyS'],
	left: ['ArrowLeft', 'KeyA'],
	right: ['ArrowRight', 'KeyD'],
	shift: ['Shift'],
	meta: ['Meta'],
	alt: ['Alt'],
	holoHud: ['KeyI'],
} satisfies Record<string, string[] | [string | string[], () => void]>

export const onKeyDown: (() => void)[] = []

const KeySubscriptions: [string | string[], () => void][] = [
	[
		'KeyM',
		() => {
			game.isMobile = true
		},
	],
]

type KeyAction = keyof typeof Keymap

export const keyboard = {
	direction: proxy(new Vector2()),
	state: Object.fromEntries(
		Object.keys(Keymap).map((key) => {
			return [key, false]
		}),
	) as { [key in KeyAction]: boolean },
	_reset() {
		for (const key in keyboard.state) {
			keyboard.state[key as KeyAction] = false
		}
	},
	_updateKeyMoves() {
		const { up, down, right, left, shift } = keyboard.state
		const z = +up - +down
		const x = +left - +right
		const speed = (!shift ? 3 : 1) * 0.4
		keyboard.direction.set(x, z).multiplyScalar(speed)
	},
}

export function useKeyboard() {
	return useSnapshot(keyboard)
}

export function KeyboardControls({ map: keymap, children }: PropsWithChildren & { map: typeof Keymap }) {
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

			for (const [keyName, action] of KeySubscriptions) if (code === keyName) action()
			for (const action of onKeyDown) action()
		},
		[toggleKey],
	)

	const upHandler = useCallback(
		({ code }: KeyboardEvent) => {
			toggleKey(code, false)
			for (const action of onKeyDown) action()
		},
		[toggleKey],
	)

	useEffect(() => {
		onKeyDown.push(keyboard._updateKeyMoves)

		const source = window
		source.addEventListener('keydown', downHandler as EventListenerOrEventListenerObject, { passive: true })
		source.addEventListener('keyup', upHandler as EventListenerOrEventListenerObject, { passive: true })

		return () => {
			source.removeEventListener('keydown', downHandler as EventListenerOrEventListenerObject)
			source.removeEventListener('keyup', upHandler as EventListenerOrEventListenerObject)
			onKeyDown.length = 0
			keyboard._reset()
		}
	}, [downHandler, upHandler])

	return children
}
