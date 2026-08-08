import type { RapierRigidBody } from '@react-three/rapier'
import type { RefObject } from 'react'
import { Euler, Matrix4, Quaternion, Vector3, type Object3D } from 'three'

import { CameraProxy } from '../../camera/camera-proxy'
import { INTERACTION_MAX_DISTANCE, UP } from '../game.store'
import type {
	ControlsState,
	EntityApi,
	EntityRuntime,
	EntityState,
	InteractionState,
	PhysicState,
} from './types/entity'

class Controls implements ControlsState {
	constructor(
		public move: Vector3 = new Vector3(),
		public orientation: Quaternion = new Quaternion(),
		public teleport?: Vector3,
	) {}
}

export class Entity implements EntityState, EntityApi {
	readonly id: string
	readonly ref: string
	readonly name: string
	readonly controls: Controls
	readonly position: Vector3
	readonly orientation: Quaternion
	physic?: PhysicState
	readonly runtime: EntityRuntime
	interaction?: InteractionState
	private cameraProxy = CameraProxy

	constructor({
		id,
		ref,
		name = id,
		initialPosition = [0, 0, 0],
		runtime,
	}: {
		id: string
		ref: string
		name?: string
		initialPosition?: [number, number, number]
		runtime: {
			object3D: RefObject<Object3D | null>
			rigidBody: RefObject<RapierRigidBody | null>
		}
	}) {
		this.id = id
		this.ref = ref
		this.name = name
		this.position = new Vector3(...initialPosition)
		this.orientation = new Quaternion()
		this.controls = new Controls()
		this.physic = {
			velocity: new Vector3(),
			isGrounded: true,
			isActive: false,
			isSleeping: false,
		}
		this.runtime = runtime
		this.interaction = {
			isInteracting: false,
		}
	}

	moveBy(delta: [number, number, number]) {
		this.controls.move.set(...delta)
		return this
	}

	moveTo(target: Vector3) {
		this.controls.move.copy(target).sub(this.physic.position)
		return this
	}

	teleportTo(target: Vector3) {
		this.controls.teleport = target.clone()

		return this
	}

	setVelocity(vel: Vector3) {
		if (!this.physic) return this
		this.physic.velocity.copy(vel)
		return this
	}

	lookAt(target: Vector3) {
		if (!this.physic || !this.physic.position) return this

		const matrix = new Matrix4()
		matrix.lookAt(this.physic.position, target, UP)
		this.physic.orientation.setFromRotationMatrix(matrix)

		return this
	}

	rotateBy(delta: [number, number, number]) {
		const euler = new Euler(...delta)
		const quaternion = new Quaternion().setFromEuler(euler)
		this.physic.orientation.multiply(quaternion)
		return this
	}

	lookInDirection(direction: Vector3) {
		if (!direction) return this

		const x = -direction.x
		const z = -direction.z
		if (x !== 0 || z !== 0) {
			const yaw = Math.atan2(x, z)
			this.orientation.setFromAxisAngle(UP, yaw)
		}

		this.cameraProxy?.lookInWorldDirection(direction)

		return this
	}

	get velocity(): Vector3 | undefined {
		return this.physic?.velocity
	}

	distanceTo(target: Vector3) {
		return this.position.distanceTo(target)
	}

	isInRange(target: Vector3, maxDistance = INTERACTION_MAX_DISTANCE) {
		return this.distanceTo(target) <= maxDistance
	}
}
