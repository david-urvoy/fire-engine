import { Quaternion, Vector3 } from 'three'
import type { EntityState } from './entity.context'

export const entityStore = {
	entities: {} as Record<string, EntityState>,
	entity(id: string) {
		const entity = entityStore.entities[id]
		if (!entity) throw new Error(`Entity "${id}" not found`)
		return entity
	},
	createEntity(name: string, position: [number, number, number]): EntityState {
		if (entityStore.entities[name]) return entityStore.entities[name]
		const entity = {
			id: name,
			controls: { move: new Vector3(), look: new Quaternion() },
			visual: { position: new Vector3(...position), orientation: new Quaternion() },
		}
		entityStore.entities[name] = entity
		return entity
	},
}
