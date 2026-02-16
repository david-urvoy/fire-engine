export type Action = keyof typeof Keymap
export const Keymap = {
	up: ['ArrowUp', 'KeyW'],
	down: ['ArrowDown', 'KeyS'],
	left: ['ArrowLeft', 'KeyA'],
	right: ['ArrowRight', 'KeyD'],
	shift: ['ShiftLeft'],
	pause: ['KeyP'],
	mobile: ['KeyM'],
	meta: ['MetaLeft'],
	alt: ['AltLeft'],
	holoHud: ['KeyI'],
	toggleDebug: ['KeyK'],
	switchCameraType: ['KeyL'],
	fullscreen: ['KeyO'],
	snap: ['KeyN'],
} as const
