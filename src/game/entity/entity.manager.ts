import { Entity } from './entity.model'

export class EntityManager {
	private readonly entities = new Map<string, Entity>()

	add(entity: Entity) {
		this.entities.set(entity.id, entity)
		return entity
	}

	get(id: string) {
		return this.entities.get(id) as unknown as Entity | null
	}

	delete(entity: Entity) {
		return this.entities.delete(entity.id)
	}
}
