import type { ReactNode } from 'react'

import { Visual } from '../../3d'
import { eventBus } from '../../lib'
import { Entity, type EntityProps } from '../entity/entity'
import { useIsCollected } from './items.manager'

export function Item({
	id,
	position,
	physic,
	children,
	...props
}: EntityProps & { physic?: ReactNode }) {
	const isCollected = useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} position={position} {...props}>
			{physic}
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
