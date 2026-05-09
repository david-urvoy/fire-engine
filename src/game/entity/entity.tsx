import { useMemo, type PropsWithChildren } from 'react'
import { Visual } from '../../3d'
import { Controllable } from '../../controls'
import { Physic } from '../../physics'
import { Gravity } from '../../physics/gravity'
import { game } from '../game.store'
import { EntityContext } from './entity.context'
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
	children,
}: PropsWithChildren<EntityProps>) {
	const entity = useMemo(() => {
		const newEntity = new EntityModel({ id: name })
		game.entities.set(name, newEntity)
		return newEntity
	}, [name])

	return (
		<EntityContext.Provider
			value={{
				id: name,
				entity,
			}}
		>
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
		</EntityContext.Provider>
	)
}
