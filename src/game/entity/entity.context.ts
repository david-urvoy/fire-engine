import { createContext, createRef, useContext, type RefObject } from 'react'
import { Object3D, Quaternion, Vector3 } from 'three'

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

export const EntityContext = createContext<{
	id: string
	ref: RefObject<Object3D | null>
	entity: EntityState
}>({
	id: '',
	ref: createRef<Object3D | null>(),
	entity: {
		id: '',
		controls: {
			move: new Vector3(),
			look: new Quaternion(),
		},
		visual: {
			position: new Vector3(),
			orientation: new Quaternion(),
		},
	},
})

export function useEntity() {
	return useContext(EntityContext)
}
