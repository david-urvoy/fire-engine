import { useEffect, useMemo, type PropsWithChildren } from 'react'

import { EntityProvider } from '../..'
import { Visual } from '../../3d'
import type { MeshProps } from '../../lib'
import { Physic } from '../../physics'
import { Gravity } from '../../physics/gravity'
import { entityManager } from './entity.manager'
import { Entity as EntityModel } from './entity.model'

export type EntityProps = PropsWithChildren<
	{
		id: string
		physic?: true
		gravity?: boolean
		fixed?: true
		visual?: boolean
		position?: [number, number, number]
		interactable?: boolean
	} & Omit<MeshProps, 'id'>
>

export function Entity({
	id,
	physic,
	gravity = true,
	fixed,
	visual = true,
	position = [0, 0, 0],
	children,
	...props
}: EntityProps) {
	const [x, y, z] = position
	const entity = useMemo(() => new EntityModel({ id, position: [x, y, z] }), [id, x, y, z])

	useEffect(() => {
		entityManager.set(id, entity)

		return () => {
			entityManager.delete(id)
		}
	}, [id, entity])

	return (
		<EntityProvider id={id} entity={entity}>
			{physic && <Physic {...(fixed && { type: 'fixed' })} position={position} />}
			{gravity && <Gravity />}
			{visual ? (
				<Visual position={position} smoothing={10} {...props}>
					{children}
				</Visual>
			) : (
				children
			)}
		</EntityProvider>
	)
}
