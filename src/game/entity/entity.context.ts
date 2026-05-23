import { createContext, useContext } from 'react'

import { Entity } from './entity.model'

export const EntityContext = createContext<{
	id: string
	entity: Entity
}>({
	id: '',
	entity: new Entity({ id: '' }),
})

export function useEntity() {
	return useContext(EntityContext)
}
