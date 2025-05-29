import { type RefObject, createRef } from 'react'
import { Vector3 } from 'three'
import { proxy } from 'valtio'

export const isDev = import.meta.env.MODE === 'development'

export const GRAVITY_CONST = 9.81
export const VERTICAL = new Vector3(0, 1, 0)
export const ZERO = new Vector3(0, 0, 0)
export const FORWARD = new Vector3(0, 0, -1)
export const characterDimensions = { halfHeight: 0.1, radius: 0.05, offset: 0.01 }
export type CharacterDimensions = typeof characterDimensions

export const game: {
	isDebug: boolean
	isMobile?: boolean
	debug?: string | number | object
	canvas: RefObject<HTMLDivElement | null>
} = proxy({
	isDebug: false,
	isMobile: 'ontouchstart' in window,
	canvas: createRef<HTMLDivElement>(),
})
