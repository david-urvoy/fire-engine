import { Visual } from '../../3d'
import { eventBus } from '../../lib'
import { Entity, type EntityProps } from '../entity/entity'
import { useIsCollected } from './items.manager'

export function Item({
	id,
	position,
	physic = false,
	children,
	...props
}: EntityProps & { physic?: boolean }) {
	const isCollected = useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} {...props}>
			<Visual
				position={position}
				smoothing={10}
				onClick={() => eventBus.emit('item_collected', { itemId: id })}
				interactable
				{...props}
			>
				{children}
			</Visual>
		</Entity>
	)
}
