type EventMap = Record<string, unknown>

type EventPayload<P> = [P] extends [void | undefined] ? [] : [payload: P]

type EventListener<P> = (...payload: EventPayload<P>) => void

export type DefaultEventMap = {
	character_interacted: { characterId: string }
	dialogue_started: { dialogueId: string }
	dialogue_ended: { dialogueId: string }
	item_collected: { itemId: string }
	clear_inventory: void
	quest_completed: { questId: string }
}

type EventListeners<T extends EventMap = DefaultEventMap> = {
	[K in keyof T]: Set<EventListener<T[K]>>
}

export class EventBus<T extends EventMap = DefaultEventMap> {
	private listeners: Partial<EventListeners<T>> = {}

	on<K extends keyof T>(eventName: K, listener: EventListener<T[K]>) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = new Set()
		}
		this.listeners[eventName].add(listener)
		return () => this.off(eventName, listener)
	}

	off<K extends keyof T>(eventName: K, listener: EventListener<T[K]>) {
		this.listeners[eventName]?.delete(listener)
	}

	emit<K extends keyof T>(eventName: K, ...payload: EventPayload<T[K]>) {
		this.listeners[eventName]?.forEach((listener) => listener(...payload))
	}
}

export const eventBus = new EventBus()
