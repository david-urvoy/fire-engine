import { Vector3 } from 'three'
import { proxy } from 'valtio'

import { audioStore } from '../audio/audio.store'
import { cameraStore } from '../camera/camera.store'
import { pointer } from '../camera/lock/pointer-lock.store'
import { responsiveStore } from '../camera/responsive/responsive.store'
import { interactable } from '../ui/interactable.store'
import { interfaceStore } from '../ui/interface.store'
import { narrativeStore } from '../ui/narrative/narrative.store'
import { tweaksStore } from '../ui/tweaks/tweaks.store'
import { dialogueStore } from './conversation/dialogue/dialogue.store'
import { debugStore } from './debug/debug.store'

export const MOVEMENT_SMOOTHING = 50
export const POINTER_SPEED = 0.8

export const GRAVITY_CONST = 9.81
export const MAX_FALLING_SPEED = Infinity

export const INTERACTION_MAX_DISTANCE = 2

export const FORWARD = new Vector3(0, 0, -1)
export const UP = new Vector3(0, 1, 0)

export const POSITION_EPSILON = 0.05

export const characterDimensions = { height: 1.8, radius: 0.25, offset: 0.01 } as const
export type CharacterDimensions = typeof characterDimensions

export const game = proxy({
	interface: interfaceStore,

	get isPaused() {
		return this.interface.pauseMenu.isActive
	},
	pause() {
		this.interface.pauseMenu.isActive = true
	},
	resume() {
		this.interface.pauseMenu.isActive = false
	},

	get uiMode(): 'gameplay' | 'pause' | 'playerMenu' | 'dialogue' | 'narrative' {
		if (this.interface.pauseMenu.isActive) return 'pause'
		if (dialogueStore.active?.locked) return 'dialogue'
		if (this.interface.playerMenu.isOpen) return 'playerMenu'
		return 'gameplay'
	},

	camera: cameraStore,
	pointer,
	interactable,
	controlledCharacter: '',
	dialogue: dialogueStore,
	narrative: narrativeStore,

	audio: audioStore,

	debug: debugStore,
	tweaks: tweaksStore,
	responsive: responsiveStore,
	toggleFullscreen: () => {},
})
