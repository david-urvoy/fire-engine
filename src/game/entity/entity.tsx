import { useEffect, useRef, type PropsWithChildren, type RefObject } from 'react'
import { Object3D, Quaternion, Vector3 } from 'three'
import { Interactable, Model, Physic } from '../../three'
import { Controllable } from '../controls'
import { game } from '../game.store'
import { EntityContext } from './entity.context'

export function Entity({
	name,
	interactable,
	controllable,
	physic,
	model = true,
	initialPosition,
	ref,
	children,
}: PropsWithChildren<{
	name: string
	interactable?: true
	controllable?: true
	physic?: true
	model?: boolean
	ref?: RefObject<Object3D>
	initialPosition?: [number, number, number]
}>) {
	const defaultRef = useRef<Object3D>(null)
	const resolvedRef = ref || defaultRef

	useEffect(() => {
		if (!resolvedRef.current) return
		resolvedRef.current.traverse((child) => {
			child.userData.entityId = name
		})
	}, [name, resolvedRef])

	if (!game.entities[name]) {
		game.entities[name] = {
			id: name,
			controls: {
				velocity: new Vector3(),
				orientation: new Quaternion(),
			},
			physic: {
				position: new Vector3(),
				orientation: new Quaternion(),
			},
			visual: {
				position: new Vector3(),
				orientation: new Quaternion(),
			},
		}
	}

	return (
		<EntityContext.Provider value={{ id: name }}>
			{controllable && <Controllable />}
			{physic && <Physic position={initialPosition} />}
			{interactable && <Interactable ref={resolvedRef} />}
			{model ? <Model ref={resolvedRef}>{children}</Model> : children}
		</EntityContext.Provider>
	)
}
