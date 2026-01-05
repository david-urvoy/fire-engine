import { createContext, useContext } from 'react'
import type { Quaternion, Vector3 } from 'three'

export type ControlsState = {
	velocity: Vector3
	orientation: Quaternion
}

export type PhysicState = {
	position: Vector3
	orientation: Quaternion
	grounded: boolean
	wasGrounded: boolean
	velocity: Vector3
}

export type VisualState = {
	position: Vector3
	orientation: Quaternion
}

export type InteractionState = {
	isInteracting: boolean
}

export type EntityState = {
	id: string
	controls: ControlsState
	physic: PhysicState
	visual: VisualState
	interaction?: InteractionState
}

export const EntityContext = createContext({
	id: '',
})

export function useEntity() {
	return useContext(EntityContext)
}
