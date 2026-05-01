import { createRef } from 'react'
import { Vector3 } from 'three'
import { PointerLockControls } from 'three-stdlib'
import { proxy, ref } from 'valtio'
import { barkStore } from './conversation/bark.store'
import { dialogueStore } from './conversation/dialogue.store'
import type { Entity } from './entity/entity.model'

export const MOVEMENT_SMOOTHING = 20
export const POINTER_SPEED = 0.8

export const GRAVITY_CONST = 9.81
export const MAX_FALLING_SPEED = Infinity

export const FORWARD = new Vector3(0, 0, -1)
export const UP = new Vector3(0, 1, 0)

export const characterDimensions = { halfHeight: 0.1, radius: 0.05, offset: 0.01 }
export type CharacterDimensions = typeof characterDimensions

export const game = proxy({
	isMobile: typeof window !== 'undefined' && 'ontouchstart' in window,
	toggleMobile() {
		game.isMobile = !game.isMobile
	},

	isDebug: false,
	toggleDebug() {
		game.isDebug = !game.isDebug
	},
	debug: undefined as unknown,

	isPaused: false,
	pause() {
		game.isPaused = true
	},
	resume() {
		game.isPaused = false
	},

	get uiMode(): 'gameplay' | 'pause' | 'dialogue' {
		if (this.isPaused) return 'pause'
		if (this.dialogue.active) return 'dialogue'
		return 'gameplay'
	},

	pointerLockControls: ref(createRef<PointerLockControls | null>()),

	controlledCharacter: '',

	entities: new Map<string, Entity>(),

	activeInteractable: '',
	setInteractable(entityId: string) {
		game.activeInteractable = entityId
	},
	clearInteractable() {
		game.activeInteractable = ''
	},

	dialogue: dialogueStore,
	barks: barkStore,
})
