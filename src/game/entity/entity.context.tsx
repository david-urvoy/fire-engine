import { createContext, useContext, type PropsWithChildren } from 'react'

import { Entity } from './entity.model'

interface EntityContextType {
	id: string
	entity: Entity
}

const EntityContext = createContext<EntityContextType>({
	id: '',
	entity: new Entity({ id: '' }),
})

export function EntityProvider({ id, entity, children }: PropsWithChildren<EntityContextType>) {
	return <EntityContext.Provider value={{ id, entity }}>{children}</EntityContext.Provider>
}

export function useEntity() {
	return useContext(EntityContext)
}
