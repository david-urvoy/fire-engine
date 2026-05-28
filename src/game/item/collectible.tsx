import type { PropsWithChildren } from 'react'

import { eventBus } from '../../lib'

export function Collectible({ id, children }: PropsWithChildren<{ id: string }>) {
	return <group onClick={() => eventBus.emit('item_collected', { itemId: id })}>{children}</group>
}
