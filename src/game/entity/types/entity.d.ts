import type { ThreeEvent } from '@react-three/fiber'
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
	runtime: PhysicRuntime
	active: boolean
}

export interface VisualState {
	position: Vector3
	orientation: Quaternion
	snap?: boolean
	runtime: VisualRuntime
}

export interface InteractionState {
	isInteracting: boolean
	runtime: InteractionRuntime
}

export interface InteractionRuntime {
	onClick?: (object: ThreeEvent<MouseEvent>) => void
	onUpdate?: (object: Object3D) => void
}

export interface EntityState {
	id: string
	ref: string
	name: string
	controls: ControlsState
	physic: PhysicState
	visual: VisualState
	interaction?: InteractionState
}

export interface EntityApi {
	moveBy: (delta: [number, number, number]) => EntityState
	teleportTo: (target: Vector3) => EntityState
	lookAt(target: Vector3): EntityState
	lookInDirection(direction: Vector3): EntityState
	setVelocity: (vel: Vector3) => EntityState
}
