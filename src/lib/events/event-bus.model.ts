import type { DefaultEventMap } from './event-bus'
import type {
	EventDefinitions,
	EventListener,
	EventListeners,
	EventMap,
	EventPayload,
} from './event-bus.types'

export class EventBus<T extends EventMap = DefaultEventMap> {
	private listeners: Partial<EventListeners<T>> = {}

	constructor(private readonly definitions: EventDefinitions<T> = {}) {}

	on<K extends keyof T>(eventName: K, listener: EventListener<T[K]>) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = new Set()
		}

		this.listeners[eventName]!.add(listener)

		return () => this.off(eventName, listener)
	}

	off<K extends keyof T>(eventName: K, listener: EventListener<T[K]>) {
		this.listeners[eventName]?.delete(listener)
	}

	emit<K extends keyof T>(eventName: K, ...payload: EventPayload<T[K]>) {
		const definition = this.definitions[eventName]

		if (definition?.canEmit && !definition.canEmit(...payload)) return

		this.listeners[eventName]?.forEach((listener) => listener(...payload))
	}
}
