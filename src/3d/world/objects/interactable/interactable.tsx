import { useEffect } from 'react'
import { useEntity } from '../../../../game'
import { sceneRegistry } from '../../../../game/entity/scene-registry'

export function Interactable() {
	const { id, ref } = useEntity()

	useEffect(() => {
		const object = { ref }
		sceneRegistry.add(id, object)

		return () => sceneRegistry.remove(id, object)
	}, [id, ref])

	return null
}
