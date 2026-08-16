import { Quaternion, Vector3 } from 'three'

import type { EntityState } from '../game/entity/entity.types'

type PhysicEntry = {
	entity: EntityState
	move?: (delta: Vector3, rotation: Quaternion) => void
}

export class PhysicSystem {
	private entities = new Map<
		string,
		PhysicEntry & { velocity: Vector3; rotation: Quaternion; refCount: number }
	>()

	step(delta: number) {
		this.entities.forEach(({ entity, velocity, rotation, move }) => {
			if (!entity.physic || entity.physic.isSleeping) return

			velocity
				.copy(entity.controls.move)
				.addScaledVector(entity.physic.velocity, 1)
				.multiplyScalar(delta)

			rotation.copy(entity.controls.orientation)

			move?.(velocity, rotation)
		})
	}

	register(character: PhysicEntry) {
		const id = character.entity.id
		const existing = this.entities.get(id)

		if (existing) {
			if (character.move && !existing.move) existing.move = character.move
			existing.refCount = (existing.refCount ?? 1) + 1
		} else {
			this.entities.set(id, {
				...character,
				velocity: new Vector3(),
				rotation: new Quaternion(),
				refCount: 1,
			})
		}
	}

	unregister(entityId: string) {
		const existing = this.entities.get(entityId)
		if (!existing) return

		if (existing.refCount <= 1) {
			this.entities.delete(entityId)
		} else {
			existing.refCount = existing.refCount - 1
		}
	}
}
