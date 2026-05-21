type EventMap = Record<string, unknown>

export type DefaultEventMap = {
	character_interacted: { characterId: string }
	dialogue_started: { dialogueId: string }
	dialogue_ended: { dialogueId: string }
	item_collected: { itemId: string }
	quest_completed: { questId: string }
}

type EventListeners<T extends EventMap = DefaultEventMap> = {
	[K in keyof T]: Set<(payload: T[K]) => void>
}

export class EventBus<T extends EventMap = DefaultEventMap> {
	private listeners: Partial<EventListeners<T>> = {}

	on<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = new Set()
		}
		this.listeners[eventName].add(listener)
		return () => this.off(eventName, listener)
	}

	off<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void) {
		this.listeners[eventName]?.delete(listener)
	}

	emit<K extends keyof T>(eventName: K, payload: T[K]) {
		this.listeners[eventName]?.forEach((listener) => listener(payload))
	}
}

export const eventBus = new EventBus()
