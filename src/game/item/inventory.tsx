import { useEffect } from 'react'

import { eventBus } from '../../lib'
import { Tweaks, useAddButton } from '../../ui'
import { useGame } from '../game.context'

export function Inventory() {
	const { itemsManager } = useGame()

	useEffect(() => {
		const unsubscribeCollectedItem = eventBus.on('item_collected', (item) => {
			itemsManager
				.collect({ id: item.itemId, collectedAt: Date.now() })
				.catch((err) => console.error('Failed to persist collected item', err))
		})
		const unsubscribeClearInventory = eventBus.on('clear_inventory', () => itemsManager.clear())

		return () => {
			unsubscribeCollectedItem()
			unsubscribeClearInventory()
		}
	}, [itemsManager])

	const folder = Tweaks.folder({ title: 'Intenvory' })
	useAddButton({
		folder,
		label: 'All items',
		title: 'Clear',
		onClick: () => eventBus.emit('clear_inventory'),
	})

	return <></>
}
