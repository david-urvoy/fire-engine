import type { PropsWithChildren } from 'react'

import { eventBus } from '../../lib'
import { Entity } from '../entity/entity'

export function Collectible({
	id,
	isActive,
	children,
}: PropsWithChildren<{ id: string; isActive?: boolean }>) {
	if (!isActive) return null

	return (
		<Entity id={id} onClick={() => eventBus.emit('item_collected', { itemId: id })} interactable>
			{children}
		</Entity>
	)
}
