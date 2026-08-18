import { Vector3 } from 'three'

import { CameraType } from '../../../camera'
import { game, useGame } from '../../../game'
import { dialogueStore } from '../../../game/conversation/dialogue/dialogue.store'
import { eventBus } from '../../../lib'
import { useToggleFullscreen } from '../../bindings/fullscreen'
import type { Action } from './keymap'

export function useKeyboardActions(): Partial<Record<Action, () => void>> {
	const toggleFullscreen = useToggleFullscreen()
	const { entityManager } = useGame()

	return {
		mobile: game.responsive.toggle,
		toggleDebug: game.debug.toggle,
		switchCameraType: () => {
			CameraType.type = CameraType.type === 'first-person' ? 'orbit' : 'first-person'
		},
		pause: game.pause,
		fullscreen: toggleFullscreen,
		snap: () => {
			const sphere = entityManager.get('sphere')
			if (!sphere) return

			sphere.teleportTo(new Vector3(2.65, sphere.position.y === 2 ? 3 : 2, -1.5))
		},
		nextDialogue: () => {
			if (!dialogueStore.active?.locked) return
			dialogueStore.active.next()
		},
		clearInventory: () => {
			eventBus.emit('clear_inventory')
			eventBus.emit('reset_quests')
		},
		gameMenu: game.gameMenu.toggle,
	}
}
