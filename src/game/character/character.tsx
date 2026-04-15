import { useEffect } from 'react'
import { useGame } from '../..'
import { Entity, type EntityProps } from '../entity/entity'

export function Character({ id, ...props }: { id: string } & Omit<EntityProps, 'name'>) {
	const { characterRepository } = useGame()

	useEffect(() => {
		characterRepository.create(id)
	}, [id, characterRepository])

	return <Entity {...props} name={id} />
}
