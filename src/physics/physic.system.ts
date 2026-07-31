import { Vector3 } from 'three'

import type { EntityState } from '../game/entity/types/entity'

type PhysicEntry = {
	entity: EntityState
	move: (delta: Vector3) => void
}

export class PhysicSystem {
	private entities = new Map<string, PhysicEntry & { tmpVelocity: Vector3 }>()

	step(delta: number) {
		this.entities.forEach(({ entity, tmpVelocity, move }) => {
			if (!entity.physic) return

			tmpVelocity
				.copy(entity.controls.move)
				.addScaledVector(entity.physic.velocity, 1)
				.multiplyScalar(delta)

			move(tmpVelocity)
		})
	}

	register(character: PhysicEntry) {
		this.entities.set(character.entity.id, { ...character, tmpVelocity: new Vector3() })
	}

	unregister(entityId: string) {
		this.entities.delete(entityId)
	}
}
