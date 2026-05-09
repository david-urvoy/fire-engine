import type { EntityState } from '../entity/types/entity'

type InteractableEntry = {
	entity: EntityState
	metadata?: Record<string, any>
}

export const sceneRegistry = {
	_interactables: new Map<string, Set<InteractableEntry>>(),

	add(entityId: string, entry: InteractableEntry) {
		if (!this._interactables.has(entityId)) {
			this._interactables.set(entityId, new Set())
		}
		if (!this._interactables.get(entityId)!.has(entry)) {
			this._interactables.get(entityId)!.add(entry)
		}
	},

	remove(entityId: string, entry: InteractableEntry) {
		const set = this._interactables.get(entityId)
		if (!set) return

		set.delete(entry)

		if (set.size === 0) {
			this._interactables.delete(entityId)
		}
	},

	getAllObjects() {
		return Array.from(this._interactables.values())
			.flatMap((set) => Array.from(set))
			.map((e) => e.entity.visual.runtime.object3D)
			.filter((e) => !!e)
	},
}
