import { GRAVITY_CONST, MAX_FALLING_SPEED } from '../game'
import type { EntityState } from '../game/entity/types/entity'

export class GravitySystem {
	private entities = new Set<EntityState>()

	step(delta: number) {
		this.entities.forEach((entity) => {
			if (!entity.physic || !entity.physic.dynamic) return

			const { velocity, isGrounded } = entity.physic

			if (isGrounded && velocity.y <= 0) {
				velocity.y = 0
				return
			}

			velocity.y = Math.max(velocity.y - GRAVITY_CONST * delta, -MAX_FALLING_SPEED)
		})
	}

	register(entity: EntityState) {
		this.entities.add(entity)
	}

	unregister(entity: EntityState) {
		this.entities.delete(entity)
	}
}
