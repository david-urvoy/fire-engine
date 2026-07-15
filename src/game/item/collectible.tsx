import type { PropsWithChildren } from 'react'

import { eventBus } from '../../lib'

export function Collectible({
	id,
	isActive,
	children,
}: PropsWithChildren<{ id: string; isActive?: boolean }>) {
	if (!isActive) return null

	return (
		<group
			onClick={(e) => {
				eventBus.emit('item_collected', { itemId: id })
				e.stopPropagation()
			}}
		>
			{children}
		</group>
	)
}
