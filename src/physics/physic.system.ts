import { Quaternion, Vector3 } from 'three'

import { MOVEMENT_SMOOTHING } from '../game'
import type { Entity } from '../game/entity/entity.model'

type PhysicEntry = {
	entity: Entity
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

			const vel = entity.physic.velocity
			const targetX = entity.controls.move.x
			const targetZ = entity.controls.move.z
			const alpha = 1 - Math.exp(-MOVEMENT_SMOOTHING * delta)
			vel.x += (targetX - vel.x) * alpha
			vel.z += (targetZ - vel.z) * alpha

			velocity.copy(vel).multiplyScalar(delta)
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
