import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Quaternion, Vector3 } from 'three'
import type { Group } from 'three/src/objects/Group.js'

import { useEntity, useGameLoopSystem } from '../..'

const tmpLocalPosition = new Vector3()
const tmpParentOrientation = new Quaternion()
const tmpLocalOrientation = new Quaternion()

export function useRegisterVisual() {
	const { id, entity } = useEntity()
	const { visual } = useGameLoopSystem()
	const objectRef = useRef<Group>(null)

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
	}, [entity, id])

	return objectRef
}

export function useVisualSync() {
	const {
		entity: { visual },
	} = useEntity()

	useFrame(() => {
		const object3D = visual.runtime.object3D
		if (!object3D) return

		const parent = object3D.parent

		tmpLocalPosition.copy(visual.position)
		parent?.worldToLocal(tmpLocalPosition)

		object3D.position.copy(tmpLocalPosition)

		if (parent) {
			parent.getWorldQuaternion(tmpParentOrientation)
			tmpLocalOrientation.copy(tmpParentOrientation).invert().multiply(visual.orientation)
			object3D.quaternion.copy(tmpLocalOrientation)
		} else {
			object3D.quaternion.copy(visual.orientation)
		}
	})
}
