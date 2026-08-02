import { useEffect, useId, useMemo, type PropsWithChildren } from 'react'

import { EntityProvider, useGame } from '../..'
import type { GroupProps } from '../../lib'
import { Entity as EntityModel } from './entity.model'

export type EntityProps = PropsWithChildren<{
	id: string
	position?: [number, number, number]
}> &
	GroupProps

export function Entity({ id, position = [0, 0, 0], children }: EntityProps) {
	const [x, y, z] = position
	const { entityManager } = useGame()
	const ref = useId()
	const entity = useMemo(
		() => new EntityModel({ id, ref, initialPosition: [x, y, z] }),
		[id, ref, x, y, z],
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
