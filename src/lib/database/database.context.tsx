import { Dexie, type DexieOptions } from 'dexie'
import { createContext, useContext, type PropsWithChildren } from 'react'

export interface DatabaseConfiguration {
	name: string
	version: number
	stores: Record<string, string>
	options?: DexieOptions
}

const DatabaseContext = createContext<Dexie | null>(null)

export function createDatabase({ name, version, stores, options }: DatabaseConfiguration) {
	const database = new Dexie(name, options)
	database.version(version).stores(stores)
	return database
}

export function DatabaseProvider({
	configuration: { name, version, stores, options },
	children,
}: PropsWithChildren<{ configuration: DatabaseConfiguration }>) {
	const database = new Dexie(name, options)
	database.version(version).stores(stores)

	return <DatabaseContext.Provider value={database}>{children}</DatabaseContext.Provider>
}

export function useDatabase(): Dexie {
	const provider = useContext(DatabaseContext)
	if (!provider) {
		throw new Error(
			'Database context is not configured. Wrap your app with DatabaseContextProvider.',
		)
	}

	return provider
}
