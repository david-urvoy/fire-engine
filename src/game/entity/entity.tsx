import type { RigidBody } from '@dimforge/rapier3d-compat'
import { useEffect, useId, useRef, useState, type PropsWithChildren, type RefObject } from 'react'
import type { Object3D } from 'three'

import { EntityProvider, useGame, type Animations } from '../..'
import { Entity as EntityModel } from './entity.model'

export type EntityProps = PropsWithChildren<{
	id: string
}>

export function Entity({ id, children }: EntityProps) {
	const { entityManager } = useGame()
	const ref = useId()
	const object3D = useRef(null)
	const rigidBody = useRef(null)
	const animations = useRef(null)
	const [entity, setEntity] = useState(
		new EntityModel({ id, ref, runtime: { object3D, rigidBody, animations } }),
	)
	const setRuntime = ({
		object3DRef,
		rigidBodyRef,
		animationsRef,
	}: {
		object3DRef?: RefObject<Object3D | null>
		rigidBodyRef?: RefObject<RigidBody | null>
		animationsRef?: RefObject<Animations | null>
	}) => {
		setEntity((entity) => {
			if (object3DRef) entity.runtime.object3D = object3DRef
			if (rigidBodyRef) entity.runtime.rigidBody = rigidBodyRef
			if (animationsRef) entity.runtime.animations = animationsRef
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
