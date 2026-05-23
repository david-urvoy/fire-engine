import { useEffect, type PropsWithChildren } from 'react'

import { eventBus } from '../../lib'
import { Entity, type EntityProps } from '../entity/entity'
import { useGame } from '../game.context'
import { CharacterProvider } from './character.context'

export function Character({
	id,
	...props
}: PropsWithChildren<
	{
		id: string
	} & Omit<EntityProps, 'name'>
>) {
	const { characterManager } = useGame()

	useEffect(() => {
		characterManager.create(id)
	}, [id, characterManager])

	return (
		<CharacterProvider id={id}>
			<Entity
				{...props}
				name={id}
				onClick={() => eventBus.emit('character_interacted', { characterId: id })}
			/>
		</CharacterProvider>
	)
}
