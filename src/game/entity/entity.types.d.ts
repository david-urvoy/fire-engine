import type { Quaternion, Vector3 } from 'three'

//#region State
export type ControlsState = {
	move: Vector3
	orientation: Quaternion
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
//#endregion

//#region API
export type EntityApi = {
	initPhysic: (dynamic?: boolean) => EntityState
	moveBy: (delta: [number, number, number]) => EntityState
	teleportTo: (target: Vector3) => EntityState
	lookAt(target: Vector3): EntityState
	lookInDirection(direction: Vector3): EntityState
	setVelocity: (vel: Vector3) => EntityState
}
//#endregion
