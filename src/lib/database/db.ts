import { Dexie, type DexieOptions } from 'dexie'

export type DatabaseStores = Record<string, string>

export interface DatabaseConfiguration {
	name: string
	version: number
	stores: DatabaseStores
	options?: DexieOptions
}

export class DatabaseProvider {
	public readonly database: Dexie

	public constructor({ name, version, stores, options }: DatabaseConfiguration) {
		const database = new Dexie(name, options)
		database.version(version).stores(stores)
		this.database = database
	}
}
