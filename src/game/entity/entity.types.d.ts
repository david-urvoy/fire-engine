import type { Quaternion, Vector3 } from 'three'

export type ControlsState = {
	move: Vector3
	look: Quaternion
	teleport?: Vector3
}

export type PhysicState = {
	position: Vector3
	orientation: Quaternion
	velocity: Vector3
	isGrounded: boolean
	dynamic?: boolean
}

export type VisualState = {
	position: Vector3
	orientation: Quaternion
	snap?: boolean
}

export type InteractionState = {
	isInteracting: boolean
}

export type EntityState = {
	id: string
	controls: ControlsState
	physic?: PhysicState
	visual: VisualState
	interaction?: InteractionState
} & EntityApi

export type EntityApi = {
	move: (delta: [number, number, number]) => EntityState
	teleportTo: (target: Vector3) => EntityState
	applyVelocity: (vel: Vector3) => EntityState
	look(dir: Quaternion): EntityState
	lookAtDirection(dir: Vector3): EntityState
	initPhysic: (dynamic?: boolean) => EntityState
	get position(): Vector3
	get orientation(): Quaternion
	get velocity(): Vector3
}
