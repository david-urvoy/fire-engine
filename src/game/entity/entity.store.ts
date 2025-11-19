import type { RefObject } from 'react'
import { Group, Quaternion, Vector3 } from 'three'
import { proxy } from 'valtio'

export type EntityState = {
	ref: RefObject<Group | null>
	velocity: Vector3
	orientation: Quaternion
}

export const controlled = proxy<{controlled: string, entities: Record<string, EntityState>}>({
	controlled: '',
	entities: {},
})
