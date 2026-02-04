import { createContext, createRef, useContext, type RefObject } from 'react'
import { Object3D } from 'three'
import { Entity } from './entity.model'
import type { EntityState } from './entity.types'

export const EntityContext = createContext<{
	id: string
	ref: RefObject<Object3D | null>
	entity: EntityState
}>({
	id: '',
	ref: createRef<Object3D | null>(),
	entity: new Entity(''),
})

export function useEntity() {
	return useContext(EntityContext)
}
