import { Vector3 } from 'three'

import type { EntityState } from '../game/entity/types/entity'

type PhysicEntry = {
	entity: EntityState
	move?: (delta: Vector3) => void
}

export class PhysicSystem {
	private entities = new Map<string, PhysicEntry & { tmpVelocity: Vector3; refCount: number }>()

	step(delta: number) {
		this.entities.forEach(({ entity, tmpVelocity, move }) => {
			if (!entity.physic || !entity.physic.isActive || entity.physic.isSleeping) return

			tmpVelocity
				.copy(entity.controls.move)
				.addScaledVector(entity.physic.velocity, 1)
				.multiplyScalar(delta)

			move?.(tmpVelocity)
		})
	}

	register(character: PhysicEntry) {
		const id = character.entity.id
		const existing = this.entities.get(id)

		if (existing) {
			if (character.move && !existing.move) existing.move = character.move
			existing.refCount = (existing.refCount ?? 1) + 1
		} else {
			this.entities.set(id, { ...character, tmpVelocity: new Vector3(), refCount: 1 })
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
