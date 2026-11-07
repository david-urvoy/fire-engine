import type { RapierRigidBody } from '@react-three/rapier'
import type { RefObject } from 'react'
import type { Object3D, Vector3 } from 'three'

import type { Animations } from '../../animation/character-animation'

export interface PhysicState {
	velocity: Vector3
	isGrounded: boolean
	setGrounded: (grounded: boolean) => void
	isSleeping: boolean
	runtime?: RapierRigidBody
}

export interface InteractionState {
	isInteracting: boolean
}

export interface EntityRuntime {
	rigidBody: RefObject<RapierRigidBody | null>
	object3D: RefObject<Object3D | null>
	animations: RefObject<Animations | null>
}
