import { GRAVITY_CONST, MAX_FALLING_SPEED } from '../../game'
import type { Entity } from '../../game/entity/entity.model'

export class GravitySystem {
	private entities = new Set<Entity>()

	step(delta: number) {
		this.entities.forEach((entity) => {
			if (!entity.physic) return

			const { isGrounded } = entity.physic
			const velocity = entity.velocity.y / delta

			if (isGrounded && velocity <= 0) {
				entity.velocity.y = 0
				return
			}

			entity.velocity.y = Math.max(velocity - GRAVITY_CONST * delta, -MAX_FALLING_SPEED)
		})
	}

	register(entity: Entity) {
		this.entities.add(entity)
	}

	unregister(entity: Entity) {
		this.entities.delete(entity)
	}
}
