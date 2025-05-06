import { Vector3 } from 'three'
import { proxy } from 'valtio'

export const isDev = import.meta.env.MODE === 'development'

export const GRAVITY_CONST = 9.81
export const VERTICAL = new Vector3(0, 1, 0)
export const ZERO = new Vector3(0, 0, 0)
export const FORWARD = new Vector3(0, 0, -1)
export const characterDimensions = { halfHeight: 0.5, radius: 0.2, offset: 0.4 }
export type CharacterDimensions = typeof characterDimensions

export const game: {
	isDebug: boolean
	isMobile?: boolean
	debug?: string | number | object
} = proxy({
	isDebug: false,
	isMobile: 'ontouchstart' in window,
})
