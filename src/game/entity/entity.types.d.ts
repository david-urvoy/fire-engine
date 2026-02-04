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
}
