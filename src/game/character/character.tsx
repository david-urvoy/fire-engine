import { useEffect, type PropsWithChildren } from 'react'

import { eventBus } from '../../lib'
import { Entity, type EntityProps } from '../entity/entity'
import { useGame } from '../game.context'
import { CharacterProvider } from './character.context'

export function Character({
	id,
	name,
	children,
	...props
}: PropsWithChildren<EntityProps & { name: string }>) {
	const { characterManager } = useGame()

	useEffect(() => {
		characterManager.create(id)
	}, [id, characterManager])

	return (
		<CharacterProvider id={id} name={name}>
			<Entity
				id={id}
				interactable
				onClick={() => eventBus.emit('character_interacted', { characterId: id })}
				{...props}
			>
				{children}
			</Entity>
		</CharacterProvider>
	)
}
