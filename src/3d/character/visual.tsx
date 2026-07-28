import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, type PropsWithChildren } from 'react'
import { Object3D, Quaternion, Vector3 } from 'three'

import { entityManager, game, MOVEMENT_SMOOTHING, useEntity, useGameLoopSystem } from '../../game'
import type { MeshProps } from '../../lib'
import { LAYERS } from '../../lib/enums/layers'

const tmpLocalPosition = new Vector3()
const tmpWorldPosition = new Vector3()
const tmpWorldOrientation = new Quaternion()
const tmpParentOrientation = new Quaternion()
const tmpLocalOrientation = new Quaternion()

export function Visual({
	position = [0, 0, 0],
	smoothing: _smoothing = MOVEMENT_SMOOTHING,
	interactable = false,
	children,
	onClick,
	...props
}: PropsWithChildren<
	MeshProps & {
		smoothing?: number
		interactable?: boolean
	}
>) {
	const { id, entity } = useEntity()
	const { visual } = useGameLoopSystem()
	const objectRef = useRef<Object3D>(null)

	useEffect(() => {
		visual.register(entity)

		return () => {
			entity.visual.runtime.object3D = undefined
			visual.unregister(entity)
		}
	}, [visual, entity])

	useLayoutEffect(() => {
		const object3D = objectRef.current
		if (!object3D) return

		entity.visual.runtime.object3D = object3D

		object3D.traverse((child) => {
			child.userData.entityId = id
		})
	}, [id, entity])

	// useEffect(() => {
	// 	const localPosition = new Vector3(...position)
	//
	// 	const worldPosition = localPosition.clone()
	// 	objectRef.current?.parent?.localToWorld(worldPosition)
	//
	// 	entity.teleportTo(worldPosition)
	// }, [entity, position])

	useFrame(() => {
		const object3D = objectRef.current
		if (!object3D) return

		const parent = object3D.parent

		if (entity.physic) {
			tmpLocalPosition.copy(entity.visual.position)
			parent?.worldToLocal(tmpLocalPosition)

			object3D.position.copy(tmpLocalPosition)

			if (parent) {
				parent.getWorldQuaternion(tmpParentOrientation)
				tmpLocalOrientation.copy(tmpParentOrientation).invert().multiply(entity.visual.orientation)
				object3D.quaternion.copy(tmpLocalOrientation)
			} else {
				object3D.quaternion.copy(entity.visual.orientation)
			}

			return
		}

		object3D.getWorldPosition(tmpWorldPosition)
		entity.visual.position.copy(tmpWorldPosition)

		object3D.getWorldQuaternion(tmpWorldOrientation)
		entity.visual.orientation.copy(tmpWorldOrientation)
	})

	return (
		<mesh
			ref={objectRef}
			position={position}
			{...props}
			onClick={(e) => {
				if (interactable && !entityManager.get(game.controlledCharacter)?.isInRange(e.point)) return

				onClick?.(e)
				e.stopPropagation()
			}}
			onUpdate={(mesh) => interactable && mesh.layers.enable(LAYERS.INTERACTABLE)}
		>
			{children}
		</mesh>
	)
}
