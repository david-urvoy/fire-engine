import { EntityManager as YukaEntityManager, type GameEntity } from 'yuka'

import { Entity } from './entity.model'

export class EntityManager {
	private readonly _yukaEntityManager = new YukaEntityManager()

	add<Entity extends GameEntity>(entity: Entity) {
		this._yukaEntityManager.add(entity)
		return entity
	}

	get(id: string) {
		return this._yukaEntityManager.getEntityByName(id) as unknown as Entity | null
	}

	delete<Entity extends GameEntity>(entity: Entity) {
		return this._yukaEntityManager.remove(entity)
	}
}
