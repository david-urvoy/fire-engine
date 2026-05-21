import { useEffect, useMemo, type PropsWithChildren } from 'react'
import { Visual } from '../../3d'
import { Controllable } from '../../controls'
import { Physic } from '../../physics'
import { Gravity } from '../../physics/gravity'
import { EntityContext } from './entity.context'
import { entityManager } from './entity.manager'
import { Entity as EntityModel } from './entity.model'
import { Interactable } from './interactable/interactable'

export type EntityProps = {
	name: string
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
	name,
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
	const entity = useMemo(() => new EntityModel({ id: name }), [name])

	useEffect(() => {
		entityManager.set(name, entity)

		return () => {
			entityManager.delete(name)
		}
	}, [name, entity])

	return (
		<EntityContext.Provider
			value={{
				id: name,
				entity,
			}}
		>
			<group onClick={onClick}>
				{controllable && <Controllable />}
				{physic && <Physic {...(fixed && { type: 'fixed' })} position={position} />}
				{gravity && <Gravity />}
				{interactable && <Interactable />}
				{visual ? (
					<Visual position={position} smoothing={10}>
						{children}
					</Visual>
				) : (
					children
				)}
			</group>
		</EntityContext.Provider>
	)
}
