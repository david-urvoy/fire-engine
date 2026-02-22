import { useEffect, useRef, type PropsWithChildren, type RefObject } from 'react'
import { Object3D, Vector3 } from 'three'
import { Visual } from '../../3d'
import { Controllable } from '../../controls'
import { Physic } from '../../physics'
import { Gravity } from '../../physics/gravity'
import { game } from '../game.store'
import { EntityContext } from './entity.context'
import { Interactable } from './interactable/interactable'

type EntityProps = {
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
		game.entities.get(name).controls.teleport = new Vector3(...position)
	}, [name, position])

	return (
		<EntityContext.Provider
			value={{ id: name, ref: resolvedRef, entity: game.entities.create(name, position) }}
		>
			{controllable && <Controllable />}
			{physic && <Physic {...(fixed && { type: 'fixed' })} position={position} />}
			{gravity && <Gravity />}
			{interactable && <Interactable />}
			{visual ? <Visual smoothing={10}>{children}</Visual> : children}
		</EntityContext.Provider>
	)
}
