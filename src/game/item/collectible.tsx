import type { PropsWithChildren } from 'react'

import { eventBus } from '../../lib'
import { Entity } from '../entity/entity'
import { useIsCollected } from './items.manager'

export function Collectible({
	id,
	children,
}: PropsWithChildren<{ id: string; isActive?: boolean }>) {
	const isCollected = useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} onClick={() => eventBus.emit('item_collected', { itemId: id })} interactable>
			{children}
		</Entity>
	)
}
