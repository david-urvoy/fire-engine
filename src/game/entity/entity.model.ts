import { Quaternion, Vector3 } from 'three'
import { CameraProxy } from '../../camera/camera-proxy'
import { UP } from '../game.store'
import type {
	ControlsState,
	EntityApi,
	EntityState,
	InteractionState,
	PhysicState,
	VisualState,
} from './types/entity'

class Controls implements ControlsState {
	constructor(
		public move: Vector3 = new Vector3(),
		public orientation: Quaternion = new Quaternion(),
		public teleport?: Vector3,
	) {}
}

class Visual implements VisualState {
	public position: Vector3 = new Vector3()
	public orientation: Quaternion = new Quaternion()
	public snap = false

	constructor(position?: [number, number, number]) {
		if (position) this.position.set(...position)
	}
}

export class Entity implements EntityState, EntityApi {
	readonly id: string
	readonly controls: Controls
	readonly visual: VisualState
	physic?: PhysicState
	interaction?: InteractionState
	private cameraProxy = CameraProxy

	constructor(id: string, position: [number, number, number] = [0, 0, 0]) {
		this.id = id
		this.controls = new Controls()
		this.visual = new Visual(position)
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

	moveBy(delta: [number, number, number]) {
		this.controls.move.set(...delta)
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
		this.cameraProxy?.lookAt(target)
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
