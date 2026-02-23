import { MOVEMENT_SMOOTHING } from '../game'
import type { EntityState } from '../game/entity/entity.types'

export class VisualSystem {
	private entities = new Set<EntityState>()

	step(delta: number) {
		this.entities.forEach((entity) => {
			if (!entity.physic) return

			const { visual, physic } = entity

			if (visual.snap) {
				visual.position.copy(physic.position)
				visual.orientation.copy(physic.orientation)
				visual.snap = false
				return
			}

			const alpha = 1 - Math.exp(-delta * MOVEMENT_SMOOTHING)

			visual.position.lerp(physic.position, alpha)
			visual.orientation.slerp(physic.orientation, alpha)
		})
	}

	register(entity: EntityState) {
		this.entities.add(entity)
	}

	unregister(entity: EntityState) {
		this.entities.delete(entity)
	}
}
