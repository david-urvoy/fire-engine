import { game, type ItemRecord } from '../../game'
import type { DialogueEvents } from '../../game/conversation/dialogue/dialogue.events'
import type { QuestEvents } from '../../game/quest/quest.events'
import { EventBus } from './event-bus.model'

export type DefaultEventMap = {
	character_interacted: { characterId: string }
	item_collected: ItemRecord
	clear_inventory: void
} & DialogueEvents &
	QuestEvents

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
