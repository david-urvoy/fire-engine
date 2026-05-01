import { useEffect, useMemo, useRef, type PropsWithChildren, type RefObject } from 'react'
import { Object3D, Vector3 } from 'three'
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
	ref?: RefObject<Object3D>
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
	ref: entityRef,
	children,
}: PropsWithChildren<EntityProps>) {
	const defaultRef = useRef<Object3D>(null)
	const resolvedRef = entityRef || defaultRef

	useEffect(() => {
		if (!resolvedRef.current) return
		resolvedRef.current.traverse((child) => {
			child.userData.entityId = name
		})
	}, [name, resolvedRef])

	useEffect(() => {
		const entity = game.entities.get(name)
		if (!entity) return

		entity.controls.teleport = new Vector3(...position)
	}, [name, position])

	const entity = useMemo(() => {
		const newEntity = new EntityModel(name, position)
		game.entities.set(name, newEntity)
		return newEntity
	}, [name, position])

	return (
		<EntityContext.Provider
			value={{
				id: name,
				ref: resolvedRef,
				entity,
			}}
		>
			{controllable && <Controllable />}
			{physic && <Physic {...(fixed && { type: 'fixed' })} position={position} />}
			{gravity && <Gravity />}
			{interactable && <Interactable />}
			{visual ? <Visual smoothing={10}>{children}</Visual> : children}
		</EntityContext.Provider>
	)
}
