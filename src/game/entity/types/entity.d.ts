import type { Quaternion, Vector3 } from 'three'

export interface ControlsState {
	move: Vector3
	orientation: Quaternion
	teleport?: Vector3
}

export interface PhysicState {
	position: Vector3
	orientation: Quaternion
	velocity: Vector3
	isGrounded: boolean
	dynamic?: boolean
}

export interface VisualState {
	position: Vector3
	orientation: Quaternion
	snap?: boolean
}

export interface InteractionState {
	isInteracting: boolean
}

export interface EntityState {
	id: string
	controls: ControlsState
	physic?: PhysicState
	visual: VisualState
	interaction?: InteractionState
}

export interface EntityApi {
	initPhysic: (dynamic?: boolean) => EntityState
	moveBy: (delta: [number, number, number]) => EntityState
	teleportTo: (target: Vector3) => EntityState
	lookAt(target: Vector3): EntityState
	lookInDirection(direction: Vector3): EntityState
	setVelocity: (vel: Vector3) => EntityState
}
