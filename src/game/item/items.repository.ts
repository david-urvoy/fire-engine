import { type Dexie } from 'dexie'

export interface ItemRecord {
	id: string
	collectedAt?: number
}

export function createItemsRepository(db: Dexie) {
	const table = db.table<ItemRecord, string>('items')

	return {
		add: async (item: ItemRecord) => table.put(item),
		get: async (id: string): Promise<ItemRecord | undefined> => table.get(id),
		all: async (): Promise<ItemRecord[]> => table.toArray(),
		isCollected: async (id: string) => !!(await table.get(id))?.collectedAt,
		clear: async () => table.clear(),
		on: (
			event: 'create' | 'update' | 'upsert' | 'delete' | 'read',
			callback: (primKey: string, obj: ItemRecord, modifications?: Object) => void,
		) => {
			if (event !== 'upsert') return

			const updateCallback = (modifications: any, primKey: string, obj: ItemRecord) => {
				callback(primKey, obj, modifications)
			}
			table.hook('creating', callback)
			table.hook('updating', updateCallback)

			return () => {
				table.hook('creating').unsubscribe(callback)
				table.hook('updating').unsubscribe(updateCallback)
			}
		},
	}
}

export type ItemsRepository = ReturnType<typeof createItemsRepository>
