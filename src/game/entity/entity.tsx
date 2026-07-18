import { useEffect, useMemo, type PropsWithChildren } from 'react'

import { Visual } from '../../3d'
import { Controllable } from '../../controls'
import { Physic } from '../../physics'
import { Gravity } from '../../physics/gravity'
import { EntityProvider } from './entity.context'
import { entityManager } from './entity.manager'
import { Entity as EntityModel } from './entity.model'
import { Interactable } from './interactable/interactable'

export type EntityProps = {
	id: string
	interactable?: true
	controllable?: true
	physic?: true
	gravity?: boolean
	fixed?: true
	visual?: boolean
	position?: [number, number, number]
	onClick?: () => void
}

export function Entity({
	id,
	interactable,
	controllable,
	physic,
	gravity = true,
	fixed,
	visual = true,
	position = [0, 0, 0],
	onClick,
	children,
}: PropsWithChildren<EntityProps>) {
	const entity = useMemo(() => new EntityModel({ id }), [id])

	useEffect(() => {
		entityManager.set(id, entity)

		return () => {
			entityManager.delete(id)
		}
	}, [id, entity])

	return (
		<EntityProvider id={id} entity={entity}>
			<Interactable disabled={!interactable} onClick={onClick}>
				{controllable && <Controllable />}
				{physic && <Physic {...(fixed && { type: 'fixed' })} position={position} />}
				{gravity && <Gravity />}
				{visual ? (
					<Visual position={position} smoothing={10}>
						{children}
					</Visual>
				) : (
					children
				)}
			</Interactable>
		</EntityProvider>
	)
}
