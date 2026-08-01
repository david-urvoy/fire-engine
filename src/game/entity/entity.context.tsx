import { createContext, useContext, type PropsWithChildren } from 'react'

import { Entity } from './entity.model'

interface EntityContextType {
	id: string
	entity: Entity
}

const EntityContext = createContext<EntityContextType | null>(null)

export function EntityProvider({ id, entity, children }: PropsWithChildren<EntityContextType>) {
	return <EntityContext.Provider value={{ id, entity }}>{children}</EntityContext.Provider>
}

export function useEntity() {
	const context = useContext(EntityContext)

	if (!context) throw new Error('useEntity must be used inside EntityProvider')

	return context
}
