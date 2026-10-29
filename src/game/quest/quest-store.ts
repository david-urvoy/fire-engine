import { useDatabase, useQuery } from '../../lib/database/use-query'
import type { Quest, QuestStatus } from './quest.model'

export interface QuestRecord {
	id: string
	name: string
	status: QuestStatus
}

export function useQuest(id: string) {
	return useQuery((database) => database.table<QuestRecord, string>('quests').get(id), [id])
}

export function useQuests() {
	return useQuery((database) => database.table<QuestRecord, string>('quests').toArray())
}

export function useOnGoingQuests() {
	return useQuery((database) =>
		database.table<QuestRecord, string>('quests').where('status').equals('ongoing').toArray(),
	)
}
export function useCompletedQuests() {
	return useQuery((database) =>
		database.table<QuestRecord, string>('quests').where('status').equals('completed').toArray(),
	)
}
export function useFailedQuests() {
	return useQuery((database) =>
		database.table<QuestRecord, string>('quests').where('status').equals('failed').toArray(),
	)
}

export function useStartQuest() {
	return useDatabase((database, { id, name }: Omit<Quest, 'status'>) =>
		database.table<QuestRecord, string>('quests').put({ id, name, status: 'ongoing' }),
	)
}

export function useCompleteQuest() {
	return useDatabase((database, id: string) =>
		database.table<QuestRecord, string>('quests').update(id, { status: 'completed' }),
	)
}

export function useFailQuest() {
	return useDatabase((database, id: string) =>
		database.table<QuestRecord, string>('quests').update(id, { status: 'failed' }),
	)
}
