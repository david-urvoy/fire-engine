import type { RapierRigidBody } from '@react-three/rapier'
import type { Object3D, Quaternion, Vector3 } from 'three'

export interface ControlsState {
	move: Vector3
	orientation: Quaternion
	teleport?: Vector3
}

export interface VisualRuntime {
	object3D?: Object3D
}

export interface PhysicRuntime {
	rigidBody?: RapierRigidBody
}

export interface PhysicState {
	position: Vector3
	orientation: Quaternion
	velocity: Vector3
	isGrounded: boolean
	dynamic?: boolean
	runtime: PhysicRuntime
}

export interface VisualState {
	localPosition: Vector3
	position: Vector3
	orientation: Quaternion
	snap?: boolean
	runtime: VisualRuntime
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
