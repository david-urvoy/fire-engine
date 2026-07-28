import { eventBus } from '../../lib'
import { Entity, type EntityProps } from '../entity/entity'
import { useIsCollected } from './items.manager'

export function Item({ id, children, ...props }: EntityProps) {
	const isCollected = useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity
			id={id}
			interactable
			onClick={() => eventBus.emit('item_collected', { itemId: id })}
			{...props}
		>
			{children}
		</Entity>
	)
}
