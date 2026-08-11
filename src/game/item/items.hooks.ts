import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'

import { useGame } from '../game.context'

export interface ItemRecord {
	id: string
	collectedAt?: number
}

export const Items = {
	useIsCollected(itemId: string) {
		const { database } = useGame()

		return useLiveQuery(
			async () => !!(await database.table<ItemRecord, string>('items').get(itemId)),
			[database, itemId],
		)
	},
	useAll() {
		const { database } = useGame()

		return useLiveQuery(() => database.table<ItemRecord, string>('items').toArray(), [database])
	},
	useCollect() {
		const { database } = useGame()

		return useCallback(
			(id: string) =>
				database.table<ItemRecord, string>('items').put({ id, collectedAt: Date.now() }),
			[database],
		)
	},
	useClear() {
		const { database } = useGame()

		return useCallback(() => database.table<ItemRecord, string>('items').clear(), [database])
	},
}
