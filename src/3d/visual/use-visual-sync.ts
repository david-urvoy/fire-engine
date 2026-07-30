import { useFrame } from '@react-three/fiber'
import { useEffect, type PropsWithChildren, type RefObject } from 'react'
import { Quaternion, Vector3, type Group } from 'three'

import { useEntity } from '../../game'
import type { GroupProps } from '../../lib'

const tmpLocalPosition = new Vector3()
const tmpParentOrientation = new Quaternion()
const tmpLocalOrientation = new Quaternion()

export function useVisualSync({
	position = [0, 0, 0],
	ref,
}: PropsWithChildren<
	GroupProps & {
		position?: [number, number, number]
		ref: RefObject<Group | null>
	}
>) {
	const { entity } = useEntity()
	const object = ref.current

	useEffect(() => {
		const localPosition = new Vector3(...position)

		const worldPosition = localPosition.clone()
		object?.parent?.localToWorld(worldPosition)

		entity.teleportTo(worldPosition)
	}, [entity, position, object])

	useFrame(() => {
		const object3D = object
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
		}
	})
}
