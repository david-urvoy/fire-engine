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
