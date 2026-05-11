import { Entity } from './entity.model'

class EntityManager {
	private readonly entities = new Map<string, Entity>()

	set(id: string, entity: Entity) {
		this.entities.set(id, entity)
		return entity
	}

	get(id: string) {
		return this.entities.get(id)
	}

	delete(id: string) {
		return this.entities.delete(id)
	}

	has(id: string) {
		return this.entities.has(id)
	}

	all() {
		return Array.from(this.entities.values())
	}
}

export const entityManager = new EntityManager()
