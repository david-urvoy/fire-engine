import { Quaternion, Vector3 } from 'three'
import type {
	ControlsState,
	EntityState,
	InteractionState,
	PhysicState,
	VisualState,
} from './entity.types'

export class Entity implements EntityState {
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
	}

	move(delta: Vector3) {
		if (!this.physic) return
		this.physic.position.add(delta)
		this.visual.snap = true
	}

	teleportTo(target: Vector3) {
		if (!this.physic) return
		this.physic.position.copy(target)
		this.physic.velocity.set(0, 0, 0)
		this.physic.isGrounded = false
		this.visual.position.copy(target)
		this.visual.snap = true
		this.controls.teleport = undefined
	}

	applyVelocity(vel: Vector3) {
		if (!this.physic) return
		this.physic.velocity.copy(vel)
	}

	getPosition(): Vector3 {
		return this.physic?.position ?? this.visual.position
	}
}
