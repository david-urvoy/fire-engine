import type { RefObject } from 'react'
import { Group, Quaternion, Vector3 } from 'three'
import { proxy, ref, useSnapshot } from 'valtio'

export type ControlsState = {
	name: string
	velocity: Vector3
	orientation: Quaternion
}

export type PhysicState = {
	position: Vector3
	orientation: Quaternion
}

export type VisualState = {
	position: Vector3
	orientation: Quaternion
}

export type EntityState = {
	ref: RefObject<Group | null>
	name: string
	controls: ControlsState
	physic: PhysicState
	visual: VisualState
}

export const playableCharacters = proxy({
	controlled: '',
	entities: ref<Record<string, EntityState>>({}),
})

export function useControlledCharacter() {
	const controlledCharacterName = useSnapshot(playableCharacters).controlled
	const controlledCharacter = playableCharacters.entities[controlledCharacterName]

	return controlledCharacter
}
