import type { RapierRigidBody } from '@react-three/rapier'
import type { Object3D } from 'three'

import type { Animations } from '../../animation/character-animation'

export interface PhysicState {
	isGrounded: boolean
	setGrounded: (grounded: boolean) => void
	isSleeping: boolean
}

export interface EntityRuntime {
	rigidBody?: RapierRigidBody | null
	object3D?: Object3D | null
	animations?: Animations | null
}
