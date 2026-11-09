import { MOVEMENT_SMOOTHING, POSITION_EPSILON } from '../game'
import type { Entity } from '../game/entity/entity.model'
import { eventBus } from '../lib'

type PhysicEntry = {
	entity: Entity
	move?: () => void
}

export class PhysicSystem {
	private entities = new Map<string, PhysicEntry & { refCount: number }>()

	step(delta: number) {
		this.entities.forEach(({ entity, move }) => {
			if (!entity.physic || entity.physic.isSleeping) return

			const velocity = entity.velocity

			if (!entity.controls.isMoving)
				if (entity.getSpeed() === 0) return
				else {
					velocity.x = 0
					velocity.z = 0
				}
			else {
				const dx = entity.controls.target.x - entity.position.x
				const dz = entity.controls.target.z - entity.position.z
				const distance = Math.hypot(dx, dz)

				if (distance < POSITION_EPSILON) eventBus.emit('hasReached', { id: entity.id })
				else {
					const targetMove = entity.controls.target
						.clone()
						.sub(entity.position)
						.normalize()
						.multiplyScalar(entity.controls.speed)

					velocity.add(targetMove).multiplyScalar(1 - Math.exp(-MOVEMENT_SMOOTHING * delta))
					velocity.y = 0
				}
			}

			velocity.multiplyScalar(delta)
			move?.()
		})
	}

	register(character: PhysicEntry) {
		const id = character.entity.id
		const existing = this.entities.get(id)

		if (existing) {
			if (character.move && !existing.move) existing.move = character.move
			existing.refCount = (existing.refCount ?? 1) + 1
		} else {
			const { entity } = character

			if (!entity.physic) {
				entity.physic = {
					isGrounded: true,
					setGrounded: (grounded: boolean) => {
						entity.physic!.isGrounded = grounded
					},
					isSleeping: false,
				}
			}

			this.entities.set(id, {
				...character,
				refCount: 1,
			})
		}
	}

	unregister(entityId: string) {
		const existing = this.entities.get(entityId)
		if (!existing) return

		if (existing.refCount <= 1) this.entities.delete(entityId)
		else {
			existing.refCount = existing.refCount - 1
		}
	}
}
