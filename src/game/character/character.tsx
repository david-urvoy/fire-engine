import { useEffect } from 'react'
import { Entity, type EntityProps } from '../entity/entity'
import { useGame } from '../game.context'

export function Character({ id, ...props }: { id: string } & Omit<EntityProps, 'name'>) {
	const { characterManager } = useGame()

	useEffect(() => {
		characterManager.create(id)
	}, [id, characterManager])

	return <Entity {...props} name={id} />
}
