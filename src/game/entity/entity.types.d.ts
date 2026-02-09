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
export type ControlsApi = {
	moveTo: (delta: [number, number, number]) => void
	teleportTo: (target: Vector3) => void
	// lookAt(target: Vector3): void
	lookInDirection(direction: Vector3): void
}

type PhysicApi = {
	applyVelocity: (vel: Vector3) => EntityState
}

export type EntityApi = ControlsApi &
	PhysicApi & {
		initPhysic: (dynamic?: boolean) => EntityState
	} & VisualApi
//#endregion
