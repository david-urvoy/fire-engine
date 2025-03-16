import { useEffect } from 'react'
import { Vector2 } from 'three'
import { proxy } from 'valtio'

export const Keymap = {
	up: ['ArrowUp', 'KeyW'],
	down: ['ArrowDown', 'KeyS'],
	left: ['ArrowLeft', 'KeyA'],
	right: ['ArrowRight', 'KeyD'],
	shift: ['ShiftLeft'],
	mobile: ['KeyM'],
	meta: ['MetaLeft'],
	alt: ['AltLeft'],
	holoHud: ['KeyI'],
} satisfies Record<string, [string] | string[]>

export const keyboard = proxy({
	direction: new Vector2(),
	state: Object.fromEntries(
		Object.keys(Keymap).map((key) => {
			return [key, false]
		}),
	) as Record<keyof typeof Keymap, boolean>,
})

export function useSubscribeKey(key: string, callback: () => void) {
	useEffect(() => {
		const handler = (event: KeyboardEvent) => event.code === key && !event.repeat && callback()
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	})
}
