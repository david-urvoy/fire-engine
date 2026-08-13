import { Vector3 } from 'three'
import { proxy } from 'valtio'

import { pointerLock } from '../camera/lock/pointer-lock.store'
import { responsiveStore } from '../camera/responsive/responsive.store'
import { gameMenu } from '../ui/game-menu/game-menu.store'
import { interactable } from '../ui/interactable.store'
import { pauseMenu } from '../ui/pause-menu/pause-menu.store'
import { dialogueStore } from './conversation/dialogue/dialogue.store'
import { debugStore } from './debug/debug.store'

export const MOVEMENT_SMOOTHING = 50
export const POINTER_SPEED = 0.8

export const GRAVITY_CONST = 9.81
export const MAX_FALLING_SPEED = Infinity

export const INTERACTION_MAX_DISTANCE = 2

export const FORWARD = new Vector3(0, 0, -1)
export const UP = new Vector3(0, 1, 0)

export const characterDimensions = { height: 1.8, radius: 0.25, offset: 0.01 } as const
export type CharacterDimensions = typeof characterDimensions

export const game = proxy({
	...pauseMenu,
	gameMenu,

	get uiMode(): 'gameplay' | 'pause' | 'dialogue' | 'hud' {
		if (this.isPaused) return 'pause'
		if (dialogueStore.active?.locked) return 'dialogue'
		if (this.gameMenu.isOpen) return 'hud'
		return 'gameplay'
	},

	pointerLock,
	interactable,
	controlledCharacter: '',
	dialogue: dialogueStore,

	debug: debugStore,
	responsive: responsiveStore,
})
