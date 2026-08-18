import { useGame, type QuestStatus } from '@david-urvoy/fire-engine'
import { useLiveQuery } from 'dexie-react-hooks'

export interface QuestRecord {
	id: string
	name: string
	status: QuestStatus
}

export function useQuest(id: string) {
	const { database } = useGame()
	return useLiveQuery(() => database.table<QuestRecord, string>('quests').get(id), [database, id])
}

export function useQuests() {
	const { database } = useGame()
	return useLiveQuery(() => database.table<QuestRecord, string>('quests').toArray(), [database])
}

export function useOnGoingQuests() {
	const { database } = useGame()
	return useLiveQuery(
		() => database.table<QuestRecord, string>('quests').where('status').equals('ongoing').toArray(),
		[database],
	)
}
export function useCompletedQuests() {
	const { database } = useGame()
	return useLiveQuery(
		() =>
			database.table<QuestRecord, string>('quests').where('status').equals('completed').toArray(),
		[database],
	)
}
export function useFailedQuests() {
	const { database } = useGame()
	return useLiveQuery(
		() => database.table<QuestRecord, string>('quests').where('status').equals('failed').toArray(),
		[database],
	)
}
