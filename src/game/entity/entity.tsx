import { useEffect, useMemo, type PropsWithChildren } from 'react'

import { EntityProvider } from '../..'
import type { GroupProps } from '../../lib'
import { entityManager } from './entity.manager'
import { Entity as EntityModel } from './entity.model'

export type EntityProps = PropsWithChildren<
	{
		id: string
		position?: [number, number, number]
	} & Omit<GroupProps, 'id'>
>

export function Entity({ id, position = [0, 0, 0], children }: EntityProps) {
	const [x, y, z] = position
	const entity = useMemo(() => new EntityModel({ id, initialPosition: [x, y, z] }), [id, x, y, z])

	useEffect(() => {
		entityManager.set(id, entity)

		return () => {
			entityManager.delete(id)
		}
	}, [id, entity])

	return (
		<EntityProvider id={id} entity={entity}>
			{children}
		</EntityProvider>
	)
}
