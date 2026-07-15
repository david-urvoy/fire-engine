import type { Dexie } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

import { useGame } from '../game.context'
import { createItemsRepository, type ItemRecord } from './items.repository'

export function createItemsManager(db: Dexie) {
	const repo = createItemsRepository(db)

	return {
		collect: (item: ItemRecord) => repo.add(item),
		get: (id: string) => repo.get(id),
		all: () => repo.all(),
		isCollected: (id: string) => () => repo.isCollected(id),
		clear: () => repo.clear(),
		on: (
			event: 'create' | 'update' | 'upsert' | 'delete' | 'read',
			callback: (primKey: string, obj: ItemRecord, modifications?: Object) => void,
		) => repo.on(event, callback),
	}
}

export function useIsCollected(itemId: string) {
	const { itemsManager } = useGame()
	return useLiveQuery(() => itemsManager.isCollected(itemId)(), [itemsManager, itemId])
}

export type ItemsManager = ReturnType<typeof createItemsManager>
