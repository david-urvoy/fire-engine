export const LAYERS = {
	DEFAULT: 0,
	INTERACTABLE: (1 << 0) | (1 << 1),
} as const satisfies Record<string, number>
