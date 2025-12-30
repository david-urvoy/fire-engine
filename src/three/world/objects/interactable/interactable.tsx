import { useEffect, type RefObject } from 'react'
import { type Object3D } from 'three'
import { useEntity } from '../../../../game'
import { sceneRegistry } from '../../../../game/entity/scene-registry'

export function Interactable({ ref }: { ref: RefObject<Object3D | null> }) {
	const { id } = useEntity()

	useEffect(() => {
		const object = { threeObject: ref }
		sceneRegistry.add(id, object)

		return () => sceneRegistry.remove(id, object)
	}, [id, ref])

	return null
}
