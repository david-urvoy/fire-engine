import { Quaternion, Vector3 } from 'three'
import { UP } from '../game.store'
import type {
	ControlsState,
	EntityApi,
	EntityState,
	InteractionState,
	PhysicState,
	VisualState,
} from './entity.types'

export class Entity implements EntityState, EntityApi {
	readonly id: string
	readonly controls: ControlsState
	readonly visual: VisualState
	physic?: PhysicState
	interaction?: InteractionState

	constructor(id: string, position: [number, number, number] = [0, 0, 0]) {
		this.id = id
		this.controls = {
			move: new Vector3(),
			look: new Quaternion(),
			teleport: undefined,
		}
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

	look(q: Quaternion) {
		const yaw = Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.z * q.z))
		this.controls.look.setFromAxisAngle(UP, yaw)
		return this
	}

	lookAtDirection(dir: Vector3) {
		const x = -dir.x
		const z = -dir.z

		if (x === 0 && z === 0) return this

		const yaw = Math.atan2(x, z)
		this.controls.look.setFromAxisAngle(UP, yaw)
		return this
	}

	get position() {
		return this.physic?.position ?? this.visual.position
	}

	get orientation(): Quaternion {
		throw new Error('Method not implemented.')
	}

	get velocity(): Vector3 {
		return this.physic?.velocity ?? new Vector3()
	}
}
