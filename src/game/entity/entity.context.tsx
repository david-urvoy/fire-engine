import type { RigidBody } from '@dimforge/rapier3d-compat'
import { createContext, useContext, type PropsWithChildren, type RefObject } from 'react'
import type { Object3D } from 'three'

import type { Animations } from '../../animation'
import { Entity } from './entity.model'

interface EntityContextType {
	id: string
	entity: Entity
	setRuntime: ({
		object3DRef,
		rigidBodyRef,
		animationsRef,
	}: {
		object3DRef?: RefObject<Object3D | null>
		rigidBodyRef?: RefObject<RigidBody | null>
		animationsRef?: RefObject<Animations | null>
	}) => void
}

const EntityContext = createContext<EntityContextType | null>(null)

export function EntityProvider({
	id,
	entity,
	setRuntime,
	children,
}: PropsWithChildren<EntityContextType>) {
	return (
		<EntityContext.Provider value={{ id, entity, setRuntime }}>{children}</EntityContext.Provider>
	)
}

export function useEntity() {
	const context = useContext(EntityContext)

	if (!context) throw new Error('useEntity must be used inside EntityProvider')

	return context
}
