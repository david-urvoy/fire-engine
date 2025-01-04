import { Vector2 } from 'three'
import { proxy, useSnapshot } from 'valtio'
import { ActionPad } from './action-pad'
import { Joystick } from './joystick'

export const gamepad: { direction: Vector2 } = proxy({
	direction: proxy(new Vector2()),
})

export function Gamepad() {
	return (
		<div
			className="pointer-events-none absolute bottom-1/4 z-50 flex w-full flex-row justify-between px-[10%]"
			onClick={(e) => e.stopPropagation()}
			onKeyDown={() => {}}
		>
			<Joystick />
			<ActionPad />
		</div>
	)
}

export function useJoystick() {
	return useSnapshot(gamepad).direction
}

export function useActionPad() {}
