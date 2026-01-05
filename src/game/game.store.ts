import { createRef } from 'react'
import { Vector3 } from 'three'
import type { PointerLockControls } from 'three-stdlib'
import { proxy, useSnapshot } from 'valtio'
import type { EntityState } from './entity/entity.context'

export const isDev = import.meta.env.MODE === 'development'

export const MOVEMENT_SMOOTHING = 20
export const POINTER_SPEED = 0.8

export const GRAVITY_CONST = 9.81
export const MAX_FALLING_SPEED = Infinity

export const FORWARD = new Vector3(0, 0, -1)

export const characterDimensions = { halfHeight: 0.1, radius: 0.05, offset: 0.01 }
export type CharacterDimensions = typeof characterDimensions

export const game = proxy({
	isDebug: false,
	isMobile: 'ontouchstart' in window,
	uiMode: 'pause' as GameUIMode,
	pause() {
		game.uiMode = 'pause'
	},
	resume() {
		GameRefs.canvas.current?.focus()
		GameRefs.pointerLockControls.current?.lock()
	},
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

type GameUIMode = 'gameplay' | 'pause' | 'debug'

export const GameRefs = {
	canvas: createRef<HTMLDivElement>(),
	pointerLockControls: createRef<PointerLockControls>(),
}
