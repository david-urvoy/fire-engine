import { useEffect } from 'react'
import { Entity, type EntityProps } from '../entity/entity'
import { useGame } from '../game.context'

export function Character({ id, ...props }: { id: string } & Omit<EntityProps, 'name'>) {
	const { characterRepository } = useGame()

	useEffect(() => {
		characterRepository.create(id)
	}, [id, characterRepository])

	return <Entity {...props} name={id} />
}
