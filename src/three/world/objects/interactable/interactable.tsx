import { useEffect } from 'react'
import { game, useEntity } from '../../../../game'

export function Interactable() {
	const { id } = useEntity()

	useEffect(() => {
		const entity = game.entities[id]
		if (!entity) return

		entity.interaction = { isInteracting: false }

		return () => {
			delete entity.interaction
		}
	}, [id])

	return null
}
