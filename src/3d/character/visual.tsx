import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, type PropsWithChildren } from 'react'
import { Object3D, Quaternion, Vector3 } from 'three'

import { MOVEMENT_SMOOTHING, useEntity, useGameLoopSystem } from '../../game'

const tmpLocalPosition = new Vector3()
const tmpWorldPosition = new Vector3()
const tmpWorldOrientation = new Quaternion()
const tmpParentOrientation = new Quaternion()
const tmpLocalOrientation = new Quaternion()

export function Visual({
	smoothing: _smoothing = MOVEMENT_SMOOTHING,
	position = [0, 0, 0],
	children,
	...props
}: PropsWithChildren<{
	smoothing?: number
	position?: [number, number, number]
}>) {
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
		if (!objectRef.current) return

		objectRef.current.traverse((child) => {
			child.userData.entityId = id
		})
	}, [id])

	useLayoutEffect(() => {
		const localPosition = new Vector3(...position)
		entity.visual.localPosition.copy(localPosition)

		const worldPosition = localPosition.clone()
		objectRef.current?.parent?.localToWorld(worldPosition)

		entity.teleportTo(worldPosition)
	}, [entity, position])

	useFrame(() => {
		const object3D = objectRef.current

		if (!object3D) return
		if (entity.visual.runtime.object3D !== object3D) {
			entity.visual.runtime.object3D = object3D
		}

		const parent = object3D.parent

		if (entity.physic) {
			tmpLocalPosition.copy(entity.visual.position)
			parent?.worldToLocal(tmpLocalPosition)

			object3D.position.copy(tmpLocalPosition)
			entity.visual.localPosition.copy(tmpLocalPosition)

			if (parent) {
				parent.getWorldQuaternion(tmpParentOrientation)
				tmpLocalOrientation.copy(tmpParentOrientation).invert().multiply(entity.visual.orientation)
				object3D.quaternion.copy(tmpLocalOrientation)
			} else {
				object3D.quaternion.copy(entity.visual.orientation)
			}

			return
		}

		entity.visual.localPosition.copy(object3D.position)
		object3D.getWorldPosition(tmpWorldPosition)
		entity.visual.position.copy(tmpWorldPosition)

		object3D.getWorldQuaternion(tmpWorldOrientation)
		entity.visual.orientation.copy(tmpWorldOrientation)
	})

	return (
		<group ref={objectRef} {...props}>
			{children}
		</group>
	)
}
