import { Quaternion, Vector3 } from 'three'
import { UP } from '../game.store'
import type {
	ControlsApi,
	ControlsState,
	EntityApi,
	EntityState,
	InteractionState,
	PhysicState,
	VisualState,
} from './entity.types'

class Controls implements ControlsState, ControlsApi {
	constructor(
		public move: Vector3 = new Vector3(),
		public orientation: Quaternion = new Quaternion(),
		public teleport?: Vector3,
		// private cameraProxy?: CameraProxy,
	) {}

	moveTo(delta: [number, number, number]) {
		this.move.set(...delta)
	}

	teleportTo(target: Vector3) {
		this.teleport = target.clone()
	}

	lookAt(target: Vector3) {
		// this.cameraProxy?.lookAt(target)
	}

	lookInDirection(direction: Vector3) {
		const x = -direction.x
		const z = -direction.z

		if (x === 0 && z === 0) return this

		const yaw = Math.atan2(x, z)
		this.orientation.setFromAxisAngle(UP, yaw)
	}
}

export class Entity implements EntityState, EntityApi {
	readonly id: string
	readonly controls: Controls
	readonly visual: VisualState
	physic?: PhysicState
	interaction?: InteractionState

	constructor(id: string, position: [number, number, number] = [0, 0, 0]) {
		this.id = id
		this.controls = new Controls()
		this.visual = {
			position: new Vector3(...position),
			orientation: new Quaternion(),
			snap: false,
		}
	}

	initPhysic(dynamic = true) {
		if (!this.physic) {
			this.physic = {
				position: this.visual.position.clone(),
				orientation: this.visual.orientation.clone(),
				velocity: new Vector3(),
				isGrounded: true,
				dynamic,
			}
		}
		return this
	}

	move(delta: [number, number, number]) {
		this.controls.move.set(...delta)
		return this
	}

	teleportTo(target: Vector3) {
		this.controls.teleport = target.clone()
		return this
	}

	applyVelocity(vel: Vector3) {
		if (!this.physic) return this
		this.physic.velocity.copy(vel)
		return this
	}

	lookAt(target: Vector3) {
		this.controls?.lookAt(target)
		return this
	}

	lookInDirection(direction: Vector3) {
		this.controls.lookInDirection(direction)
		return this
	}

	get position() {
		return this.physic?.position ?? this.visual.position
	}

	get orientation(): Quaternion {
		return this.controls.orientation
	}

	get velocity(): Vector3 {
		return this.physic?.velocity ?? new Vector3()
	}
}
