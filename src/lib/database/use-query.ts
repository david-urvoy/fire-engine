import type Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

import { useGame } from '../../game'

export function useQuery<R, TDefault>(
	callback: (database: Dexie) => R | Promise<R>,
	deps?: any[],
	defaultResult?: TDefault,
): R | TDefault | undefined {
	const { database } = useGame()
	return useLiveQuery(() => callback(database), [database, ...(deps ?? [])], defaultResult)
}

export function useDatabase<R>(callback: (database: Dexie, args?: any) => R) {
	const { database } = useGame()
	return (args?: any) => callback(database, args)
}
