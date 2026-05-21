import { cloneElement, useEffect, type ReactElement } from 'react'
import { eventBus } from '../../lib'
import { useDialogueResolver } from '../conversation'
import { Entity, type EntityProps } from '../entity/entity'
import { useGame } from '../game.context'

export function Character({
	id,
	dialogueResolver,
	children,
	...props
}: {
	id: string
	dialogueResolver?: () => string | undefined
	children: ReactElement<{ onClick?: () => void }>
} & Omit<EntityProps, 'name'>) {
	const { characterManager, dialogueManager } = useGame()
	useDialogueResolver({
		characterId: id,
		onSubscribe: () => {
			const dialogueId = dialogueResolver?.()
			if (!dialogueId) return

			dialogueManager.trigger(dialogueId)
		},
	})

	useEffect(() => {
		characterManager.create(id)
	}, [id, characterManager])

	return (
		<Entity {...props} name={id}>
			{!children
				? children
				: cloneElement(children, {
						onClick: () => eventBus.emit('character_interacted', { characterId: id }),
					})}
		</Entity>
	)
}
