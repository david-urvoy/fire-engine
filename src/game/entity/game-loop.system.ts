import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import type { RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { type EntityState, GRAVITY_CONST, MAX_FALLING_SPEED } from '..'

type Collider = ReturnType<RapierRigidBody['collider']>

const GravitySystem = {
	entities: new Set<EntityState>(),

	step(delta: number) {
		this.entities.forEach((entity) => {
			if (entity.physic.grounded && entity.physic.velocity.y <= 0) {
				entity.physic.velocity.y = 0
				return
			}

			if (entity.physic.velocity.y > -MAX_FALLING_SPEED) {
				entity.physic.velocity.y -= GRAVITY_CONST * delta
			}
		})
	},

	register(entity: EntityState) {
		this.entities.add(entity)
	},

	unregister(entity: EntityState) {
		this.entities.delete(entity)
	},
}

const PhysicSystem = {
	entities: new Set<EntityState>(),

	step(delta: number) {
		this.entities.forEach((entity) => {
			entity.physic.position.addScaledVector(entity.controls.velocity, delta)
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

const CharacterControllerSystem = {
	characters: new Map<string, CharacterEntry>(),

	register(character: CharacterEntry) {
		this.characters.set(character.entity.id, character)
	},

	unregister(entityId: string) {
		this.characters.delete(entityId)
	},

	step(delta: number) {
		this.characters.forEach(({ entity, controller, collider }) => {
			if (!controller) return

			const velocity = new Vector3().copy(entity.controls.velocity)
			velocity.y += entity.physic.velocity.y

			const desiredMovement = velocity.multiplyScalar(delta)

			controller.computeColliderMovement(collider, desiredMovement)

			const translation = controller.computedMovement()
			entity.physic.position.add(translation)

			entity.physic.grounded = controller.computedGrounded()
		})
	},
}

export const GameLoopSystem = {
	step(delta: number) {
		CharacterControllerSystem.step(delta)
		GravitySystem.step(delta)
		PhysicSystem.step(delta)
	},

	systems: {
		gravity: GravitySystem,
		physic: PhysicSystem,
		characterController: CharacterControllerSystem,
	},
}
