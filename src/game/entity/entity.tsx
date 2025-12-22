import { useEffect, useRef, type PropsWithChildren } from 'react'
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
	initialPosition,
	children,
}: PropsWithChildren<{
	name: string
	interactable?: true
	controllable?: true
	physic?: true
	initialPosition?: [number, number, number]
}>) {
	const ref = useRef<Object3D>(null)

	useEffect(() => {
		if (!ref.current) return
		ref.current.traverse((child) => {
			child.userData.entityId = name
		})
	}, [name, ref])

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
			{interactable && <Interactable ref={ref} />}
			<Model ref={ref}>{children}</Model>
		</EntityContext.Provider>
	)
}
