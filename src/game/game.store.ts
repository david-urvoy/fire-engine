import { Vector3 } from 'three'
import { proxy, useSnapshot } from 'valtio'
import { entityStore } from './entity/entity.store'

export const MOVEMENT_SMOOTHING = 20
export const POINTER_SPEED = 0.8

export const GRAVITY_CONST = 9.81
export const MAX_FALLING_SPEED = Infinity

export const FORWARD = new Vector3(0, 0, -1)

export const characterDimensions = { halfHeight: 0.1, radius: 0.05, offset: 0.01 }
export type CharacterDimensions = typeof characterDimensions

export const game = proxy({
	isMobile: 'ontouchstart' in window,
	toggleMobile() {
		game.isMobile = !game.isMobile
	},

	isDebug: false,
	toggleDebug() {
		game.isDebug = !game.isDebug
	},

	isPaused: false,
	pause() {
		game.isPaused = true
	},
	resume() {
		game.isPaused = false
	},

	get uiMode(): 'gameplay' | 'pause' {
		if (this.isPaused) return 'pause'
		return 'gameplay'
	},

	controlledCharacter: '',

	activeInteractable: '',
	setInteractable(entityId: string) {
		game.activeInteractable = entityId
	},
	clearInteractable() {
		game.activeInteractable = ''
	},

	debug: undefined as unknown,
	...entityStore,
})

export function useControlledCharacter() {
	const controlledCharacterName = useSnapshot(game).controlledCharacter
	const controlledCharacter = game.entities[controlledCharacterName]

	return controlledCharacter
}
