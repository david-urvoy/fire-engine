import { useEffect } from 'react'

import { eventBus } from '../../lib'
import { Tweaks, useAddButton } from '../../ui'
import { Items } from './items.hooks'

export function Inventory() {
	const collect = Items.useCollect()
	const clear = Items.useClear()

	useEffect(() => {
		const unsubscribeCollectedItem = eventBus.on('item_collected', (item) => {
			collect(item).catch((err) => console.error('Failed to persist collected item', err))
		})
		const unsubscribeClearInventory = eventBus.on('clear_inventory', () =>
			clear().catch((err) => console.error('Failed to clear inventory', err)),
		)

		return () => {
			unsubscribeCollectedItem()
			unsubscribeClearInventory()
		}
	}, [collect, clear])

	const folder = Tweaks.folder({ title: 'Intenvory' })
	useAddButton({
		folder,
		label: 'All items',
		title: 'Clear',
		onClick: () => eventBus.emit('clear_inventory'),
	})

	return <></>
}
