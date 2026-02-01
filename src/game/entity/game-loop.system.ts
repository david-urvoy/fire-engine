import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import type { RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { type EntityState, GRAVITY_CONST, MAX_FALLING_SPEED, MOVEMENT_SMOOTHING } from '..'

type Collider = ReturnType<RapierRigidBody['collider']>

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
	controller: KinematicCharacterController
	collider: Collider
}

const PhysicSystem = {
	characters: new Map<string, CharacterEntry & { tmpVelocity: Vector3 }>(),

	step(delta: number) {
		this.characters.forEach(({ entity, controller, collider, tmpVelocity }) => {
			if (!entity.physic || !entity.physic.dynamic) return

			tmpVelocity
				.copy(entity.controls.move)
				.addScaledVector(entity.physic.velocity, 1)
				.multiplyScalar(delta)

			controller.computeColliderMovement(collider, tmpVelocity)

			const translation = controller.computedMovement()
			entity.physic.position.add(translation)

			entity.physic.isGrounded = controller.computedGrounded()
		})
	},

	register(character: CharacterEntry) {
		this.characters.set(character.entity.id, { ...character, tmpVelocity: new Vector3() })
	},

	unregister(entityId: string) {
		this.characters.delete(entityId)
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

			const alpha = 1 - Math.exp(-delta * MOVEMENT_SMOOTHING)

			entity.visual.position.lerp(entity.physic.position, alpha)
			entity.visual.orientation.slerp(entity.physic.orientation, alpha)
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
