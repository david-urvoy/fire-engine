import { useDatabase, useQuery } from '../../lib/database/use-query'

export interface ItemRecord {
	id: string
	name: string
	image?: string
	collectedAt?: number
}

export const Items = {
	useIsCollected(itemId: string) {
		return useQuery(
			async (database) => !!(await database.table<ItemRecord, string>('items').get(itemId)),
			[itemId],
		)
	},
	useAll() {
		return useQuery((database) => database.table<ItemRecord, string>('items').toArray())
	},
	useCollect() {
		return useDatabase((database, { id, name, image }: ItemRecord) =>
			database
				.table<ItemRecord, string>('items')
				.put({ id, name, image, collectedAt: Temporal.Now.instant().epochMilliseconds }),
		)
	},
	useClear() {
		return useDatabase((database) => database.table<ItemRecord, string>('items').clear())
	},
	useDelete(itemid: string) {
		return useDatabase((database) => database.table<ItemRecord, string>('items').delete(itemid))
	},
}
