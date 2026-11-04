import { Quaternion, Vector3 } from 'three'

import { MOVEMENT_SMOOTHING, POSITION_EPSILON } from '../game'
import type { Entity } from '../game/entity/entity.model'
import { eventBus } from '../lib'

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

			if (entity.controls.isMoving) {
				const dx = entity.controls.target.x - entity.position.x
				const dz = entity.controls.target.z - entity.position.z
				const distance = Math.hypot(dx, dz)

				if (distance < POSITION_EPSILON) {
					vel.x = 0
					vel.z = 0
					eventBus.emit('hasReached', { id: entity.id })
				} else {
					const targetMove = entity.controls.target
						.clone()
						.sub(entity.position)
						.normalize()
						.multiplyScalar(entity.controls.speed)
					const alpha = 1 - Math.exp(-MOVEMENT_SMOOTHING * delta)
					vel.x += (targetMove.x - vel.x) * alpha
					vel.z += (targetMove.z - vel.z) * alpha
				}
			} else {
				vel.x = 0
				vel.z = 0
			}

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
			const { entity } = character

			if (!entity.physic) {
				entity.physic = {
					velocity: new Vector3(),
					isGrounded: true,
					isSleeping: false,
				}
			}

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

		if (existing.refCount <= 1) this.entities.delete(entityId)
		else {
			existing.refCount = existing.refCount - 1
		}
	}
}
