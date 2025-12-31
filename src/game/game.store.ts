import { createRef } from 'react'
import { Vector3 } from 'three'
import { proxy, useSnapshot } from 'valtio'
import type { EntityState } from './entity/entity.context'

export const isDev = import.meta.env.MODE === 'development'

export const GRAVITY_CONST = 9.81
export const MAX_FALLING_SPEED = 14
export const VERTICAL = new Vector3(0, 1, 0)
export const ZERO = new Vector3(0, 0, 0)
export const FORWARD = new Vector3(0, 0, -1)
export const characterDimensions = { halfHeight: 0.1, radius: 0.05, offset: 0.01 }
export type CharacterDimensions = typeof characterDimensions

export const game = proxy({
	isDebug: false,
	isMobile: 'ontouchstart' in window,
	canvas: createRef<HTMLDivElement>(),
	entities: {} as Record<string, EntityState>,
	activeInteractable: '',
	controlledCharacter: '',
	debug: undefined as unknown,
})

export function useControlledCharacter() {
	const controlledCharacterName = useSnapshot(game).controlledCharacter
	const controlledCharacter = game.entities[controlledCharacterName]

	return controlledCharacter
}
