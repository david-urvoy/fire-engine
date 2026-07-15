import { useEffect } from 'react'

import { eventBus } from '../../lib'
import { Tweaks, useAddButton } from '../../ui'
import { useGame } from '../game.context'

export function Inventory({ resolver }: { resolver: (arg: { itemId: string }) => void }) {
	const { itemsManager } = useGame()

	useEffect(() => {
		const unsubscribeCollectedItem = eventBus.on('item_collected', resolver)
		const unsubscribeClearInventory = eventBus.on('clear_inventory', () => itemsManager.clear())

		return () => {
			unsubscribeCollectedItem()
			unsubscribeClearInventory()
		}
	}, [resolver, itemsManager])

	const folder = Tweaks.folder({ title: 'Intenvory' })
	useAddButton({
		folder,
		label: 'All items',
		title: 'Clear',
		onClick: () => eventBus.emit('clear_inventory'),
	})

	return <></>
}
