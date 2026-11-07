import type { RigidBody } from '@dimforge/rapier3d-compat'
import { useEffect, useState, type PropsWithChildren } from 'react'
import type { Object3D } from 'three'

import { EntityProvider, useGame, type Animations } from '../..'
import { Entity as EntityModel } from './entity.model'

export type EntityProps = PropsWithChildren<{
	id: string
}>

export function Entity({ id, children }: EntityProps) {
	const { entityManager } = useGame()
	const [entity, setEntity] = useState(
		new EntityModel({ id, runtime: { object3D: null, rigidBody: null, animations: null } }),
	)
	const setRuntime = ({
		object3D,
		rigidBody,
		animations,
	}: {
		object3D?: Object3D | null
		rigidBody?: RigidBody | null
		animations?: Animations | null
	}) => {
		setEntity((entity) => {
			if (object3D) entity.runtime.object3D = object3D
			if (rigidBody) entity.runtime.rigidBody = rigidBody
			if (animations) entity.runtime.animations = animations
			return entity
		})
	}

	useEffect(() => {
		entityManager.set(id, entity)

		return () => {
			entityManager.delete(id)
		}
	}, [id, entity, entityManager])

	return (
		<EntityProvider id={id} entity={entity} setRuntime={setRuntime}>
			{children}
		</EntityProvider>
	)
}
