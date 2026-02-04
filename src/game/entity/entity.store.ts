import { Entity } from './entity.model'
import type { EntityState } from './entity.types'

class EntityStore {
	map: Record<string, EntityState> = {}

	all(): EntityState[] {
		return Object.values(this.map)
	}

	get(id: string): EntityState {
		const entity = this.map[id]
		if (!entity) throw new Error(`Entity "${id}" not found`)
		return entity
	}

	create(name: string, position: [number, number, number]): EntityState {
		if (this.map[name]) return this.map[name]
		const entity = new Entity(name, position)
		this.map[name] = entity
		return entity
	}

	entities(): EntityState[]
	entities(id: string): EntityState
	entities(id?: string): EntityState | EntityState[] {
		if (id != null) return this.get(id)
		return this.all()
	}
}

export const entities = new EntityStore()
