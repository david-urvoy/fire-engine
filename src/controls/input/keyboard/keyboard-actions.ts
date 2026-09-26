import { Vector3 } from 'three'

import { pane } from '../../..'
import { game, useGame } from '../../../game'
import { dialogueStore } from '../../../game/conversation/dialogue/dialogue.store'
import { eventBus } from '../../../lib'
import type { Action } from './keymap'

export function useKeyboardActions(): Partial<Record<Action, () => void>> {
	const { entityManager } = useGame()

	return {
		mobile: game.responsive.toggle,
		toggleDebug: game.debug.toggle,
		switchCameraType: () => {
			game.camera.type = game.camera.type === 'first-person' ? 'orbit' : 'first-person'
		},
		pause: game.pause,
		fullscreen: game.toggleFullscreen,
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
		gameMenu: game.gameInterface.toggle,
		toggleTweaks: () => {
			pane.expanded = !pane.expanded
			if (pane.expanded) game.pointerLock.ref.current?.unlock()
		},
	}
}
