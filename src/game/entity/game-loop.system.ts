import { Vector3 } from 'three'
import { GRAVITY_CONST, MAX_FALLING_SPEED, MOVEMENT_SMOOTHING } from '..'
import type { EntityState } from './entity.types'

const GravitySystem = {
	entities: new Set<EntityState>(),

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
	},

	register(entity: EntityState) {
		this.entities.add(entity)
	},

	unregister(entity: EntityState) {
		this.entities.delete(entity)
	},
}

type CharacterEntry = {
	entity: EntityState
	move: (delta: Vector3) => void
}

const PhysicSystem = {
	entities: new Map<string, CharacterEntry & { tmpVelocity: Vector3 }>(),

	step(delta: number) {
		this.entities.forEach(({ entity, tmpVelocity, move }) => {
			if (!entity.physic) return

			tmpVelocity
				.copy(entity.controls.move)
				.addScaledVector(entity.physic.velocity, 1)
				.multiplyScalar(delta)

			move(tmpVelocity)
		})
	},

	register(character: CharacterEntry) {
		this.entities.set(character.entity.id, { ...character, tmpVelocity: new Vector3() })
	},

	unregister(entityId: string) {
		this.entities.delete(entityId)
	},
}

const VisualSystem = {
	entities: new Set<EntityState>(),

	register(entity: EntityState) {
		this.entities.add(entity)
	},

	unregister(entity: EntityState) {
		this.entities.delete(entity)
	},

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
	},
}

export const GameLoopSystem = {
	step(delta: number) {
		GravitySystem.step(delta)
		PhysicSystem.step(delta)
		VisualSystem.step(delta)
	},

	systems: {
		gravity: GravitySystem,
		physic: PhysicSystem,
		visual: VisualSystem,
	},
}
