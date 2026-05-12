export const Keymap = {
	movement: {
		up: ['ArrowUp', 'KeyW'],
		down: ['ArrowDown', 'KeyS'],
		left: ['ArrowLeft', 'KeyA'],
		right: ['ArrowRight', 'KeyD'],
		sprint: ['ShiftLeft'],
	},
	dialogue: {
		nextDialogue: ['Space'],
	},
	uiCommand: {
		pause: ['KeyP'],
		mobile: ['KeyM'],
		toggleDebug: ['KeyK'],
		switchCameraType: ['KeyL'],
		fullscreen: ['KeyO'],
	},
	misc: {
		meta: ['MetaLeft'],
		alt: ['AltLeft'],
		holoHud: ['KeyI'],
		snap: ['KeyN'],
	},
} as const

export type Category = keyof typeof Keymap
export type Action = { [C in Category]: keyof (typeof Keymap)[C] }[Category]

// Pre-compute a map from keyboard code to action+category for O(1) lookup
export const KEYBOARD_CODE_TO_ACTION = (() => {
	const result: Record<string, { action: string; category: string }> = {}

	for (const [category, actions] of Object.entries(Keymap)) {
		for (const [action, keys] of Object.entries(actions)) {
			for (const code of keys) {
				result[code] = { action, category }
			}
		}
	}

	return result as Record<string, { action: Action; category: Category }>
})()
