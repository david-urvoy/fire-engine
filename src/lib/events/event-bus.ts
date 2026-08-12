import { game, type ItemRecord } from '../../game'
import { EventBus } from './event-bus.model'

export type DefaultEventMap = {
	character_interacted: { characterId: string }
	dialogue_started: { dialogueId: string }
	dialogue_ended: { dialogueId: string }
	item_collected: ItemRecord
	clear_inventory: void
	quest_completed: { questId: string }
}

function isPointerLocked() {
	return game.pointerLock.ref.current?.isLocked ?? false
}

export const eventBus = new EventBus<DefaultEventMap>({
	character_interacted: {
		canEmit: isPointerLocked,
	},
	item_collected: {
		canEmit: isPointerLocked,
	},
})
