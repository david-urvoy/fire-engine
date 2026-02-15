import { Entity } from './entity.model'

class EntityStore {
	map: Record<string, Entity> = {}

	all(): Entity[] {
		return Object.values(this.map)
	}

	get(id: string): Entity {
		const entity = this.map[id]
		if (!entity) throw new Error(`Entity "${id}" not found`)
		return entity
	}

	create(name: string, position: [number, number, number]): Entity {
		if (this.map[name]) return this.map[name]
		const entity = new Entity(name, position)
		this.map[name] = entity
		return entity
	}

	entities(): Entity[]
	entities(id: string): Entity
	entities(id?: string): Entity | Entity[] {
		if (id != null) return this.get(id)
		return this.all()
	}
}

export const entities = new EntityStore()
