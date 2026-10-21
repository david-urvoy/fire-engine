import { Dexie, type DexieOptions } from 'dexie'

interface DatabaseConfiguration {
	name: string
	version: number
	stores: Record<string, string>
	options?: DexieOptions
}

export function createDatabase({ name, version, stores, options }: DatabaseConfiguration) {
	const database = new Dexie(name, options)
	database.version(version).stores(stores)
	return database
}
