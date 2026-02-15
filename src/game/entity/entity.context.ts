import { createContext, createRef, useContext, type RefObject } from 'react'
import { Object3D } from 'three'
import { Entity } from './entity.model'

export const EntityContext = createContext<{
	id: string
	ref: RefObject<Object3D | null>
	entity: Entity
}>({
	id: '',
	ref: createRef(),
	entity: new Entity(''),
})

export function useEntity() {
	return useContext(EntityContext)
}
