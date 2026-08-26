import { useGame } from '@david-urvoy/fire-engine'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'

import type { Quest, QuestStatus } from './quest.model'

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

export function useStartQuest() {
	const { database } = useGame()

	return useCallback(
		({ id, name }: Omit<Quest, 'status'>) =>
			database.table<QuestRecord, string>('quests').put({ id, name, status: 'ongoing' }),
		[database],
	)
}

export function useCompleteQuest() {
	const { database } = useGame()

	return useCallback(
		(id: string) =>
			database.table<QuestRecord, string>('quests').update(id, { status: 'completed' }),
		[database],
	)
}

export function useFailQuest() {
	const { database } = useGame()

	return useCallback(
		(id: string) => database.table<QuestRecord, string>('quests').update(id, { status: 'failed' }),
		[database],
	)
}
