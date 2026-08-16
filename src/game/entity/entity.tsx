import { useEffect, useId, useMemo, useRef, type PropsWithChildren } from 'react'

import { EntityProvider, useGame } from '../..'
import { Entity as EntityModel } from './entity.model'

export type EntityProps = PropsWithChildren<{
	id: string
}>

export function Entity({ id, children }: EntityProps) {
	const { entityManager } = useGame()
	const ref = useId()
	const object3D = useRef(null)
	const rigidBody = useRef(null)
	const entity = useMemo(
		() => new EntityModel({ id, ref, runtime: { object3D, rigidBody } }),
		[id, ref],
	)

	useEffect(() => {
		entityManager.set(id, entity)

		return () => {
			entityManager.delete(id)
		}
	}, [id, entity, entityManager])

	return (
		<EntityProvider id={id} entity={entity}>
			{children}
		</EntityProvider>
	)
}
