import { GRAVITY_CONST, MAX_FALLING_SPEED } from '../../game'
import type { Entity } from '../../game/entity/entity.model'

export class GravitySystem {
	private entities = new Set<Entity>()

	step(delta: number) {
		this.entities.forEach((entity) => {
			if (!entity.physic) return

			const { velocity, isGrounded } = entity.physic

			if (isGrounded && velocity.y <= 0) {
				velocity.y = 0
				return
			}

			velocity.y = Math.max(velocity.y - GRAVITY_CONST * delta, -MAX_FALLING_SPEED)
		})
	}

	register(entity: Entity) {
		this.entities.add(entity)
	}

	unregister(entity: Entity) {
		this.entities.delete(entity)
	}
}
