import { useEffect } from 'react'

import { eventBus } from '../../lib'

export function Inventory({
	resolver,
}: {
	resolver: (arg: { itemId: string }) => string | undefined
}) {
	useEffect(() => {
		const unsubscribe = eventBus.on('item_collected', resolver)

		return () => {
			unsubscribe()
		}
	}, [resolver])

	return <></>
}
