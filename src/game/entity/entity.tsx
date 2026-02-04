import { useEffect, useRef, type PropsWithChildren, type RefObject } from 'react'
import { Object3D, Quaternion, Vector3 } from 'three'
import { Interactable, Model, Physic } from '../../3d'
import { Gravity } from '../../3d/world/character/physics/gravity'
import { Controllable } from '../../controls'
import { game } from '../game.store'
import { EntityContext } from './entity.context'

type EntityProps = {
	name: string
	interactable?: true
	controllable?: true
	physic?: true
	gravity?: boolean
	fixed?: true
	model?: boolean
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
	model = true,
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
		const entity = game.entities[name]
		if (!entity) return

		entity.controls.teleport = new Vector3(...position)
	}, [name, position])

	if (!game.entities[name]) {
		game.entities[name] = {
			id: name,
			controls: {
				move: new Vector3(),
				look: new Quaternion(),
			},
			visual: {
				position: new Vector3(...position),
				orientation: new Quaternion(),
			},
		}
	}

	return (
		<EntityContext.Provider value={{ id: name, ref: resolvedRef }}>
			{controllable && <Controllable />}
			{physic && <Physic {...(fixed && { type: 'fixed' })} position={position} />}
			{gravity && <Gravity />}
			{interactable && <Interactable />}
			{model ? <Model smoothing={10}>{children}</Model> : children}
		</EntityContext.Provider>
	)
}
