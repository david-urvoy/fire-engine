import type { RapierRigidBody } from '@react-three/rapier'
import type { RefObject } from 'react'
import type { Object3D, Quaternion, Vector3 } from 'three'

export interface ControlsState {
	move: Vector3
	orientation: Quaternion
	teleport?: Vector3
}

export interface PhysicState {
	velocity: Vector3
	isGrounded: boolean
	isActive: boolean
	isSleeping: boolean
	runtime?: RapierRigidBody
}

export interface InteractionState {
	isInteracting: boolean
}

interface EntityRuntime {
	rigidBody?: RefObject<RapierRigidBody | null>
	object3D?: RefObject<Object3D | null>
}

export interface EntityState {
	id: string
	ref: string
	name: string
	position: Vector3
	orientation: Quaternion
	controls: ControlsState
	physic?: PhysicState
	runtime: EntityRuntime
	interaction?: InteractionState
}

export interface EntityApi {
	moveBy: (delta: [number, number, number]) => EntityState
	teleportTo: (target: Vector3) => EntityState
	lookAt(target: Vector3): EntityState
	lookInDirection(direction: Vector3): EntityState
	setVelocity: (vel: Vector3) => EntityState
}
