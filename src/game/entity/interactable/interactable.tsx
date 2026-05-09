import { useEffect } from 'react'
import { useEntity } from '../..'
import { sceneRegistry } from '../../system/scene-registry'

export function Interactable() {
	const { id, entity } = useEntity()

	useEffect(() => {
		const object = { entity }
		sceneRegistry.add(id, object)

		return () => sceneRegistry.remove(id, object)
	}, [id, entity])

	return null
}
