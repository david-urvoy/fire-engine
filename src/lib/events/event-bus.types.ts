export type EventMap = Record<string, unknown>

export type EventPayload<P> = [P] extends [void] ? [] : [payload: P]

export type EventListener<P> = (...payload: EventPayload<P>) => void

export type EventDefinition<P> = {
	canEmit?: (...payload: EventPayload<P>) => boolean | undefined
}

export type EventDefinitions<T extends EventMap> = {
	[K in keyof T]?: EventDefinition<T[K]>
}

export type EventListeners<T extends EventMap> = {
	[K in keyof T]: Set<EventListener<T[K]>>
}
