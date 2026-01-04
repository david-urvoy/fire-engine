export type Action = keyof typeof Keymap
export const Keymap = {
	up: ['ArrowUp', 'KeyW'],
	down: ['ArrowDown', 'KeyS'],
	left: ['ArrowLeft', 'KeyA'],
	right: ['ArrowRight', 'KeyD'],
	shift: ['ShiftLeft'],
	pause: ['KeyT'],
	mobile: ['KeyM'],
	meta: ['MetaLeft'],
	alt: ['AltLeft'],
	holoHud: ['KeyI'],
	toggleDebug: ['KeyK'],
	switchCameraType: ['KeyP'],
	fullscreen: ['KeyO'],
} as const
