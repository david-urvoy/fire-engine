import { useCallback, useEffect } from 'react'

import { eventBus } from '../../lib'
import { useGame } from '../game.context'
import type { QuestRecord } from './quest-store'
import type { Quest } from './quest.model'

function useStartQuest() {
	const { database } = useGame()

	return useCallback(
		({ id, name }: Omit<Quest, 'status'>) =>
			database.table<QuestRecord, string>('quests').put({ id, name, status: 'ongoing' }),
		[database],
	)
}

function useCompleteQuest() {
	const { database } = useGame()

	return useCallback(
		(id: string) =>
			database.table<QuestRecord, string>('quests').update(id, { status: 'completed' }),
		[database],
	)
}

function useFailQuest() {
	const { database } = useGame()

	return useCallback(
		(id: string) => database.table<QuestRecord, string>('quests').update(id, { status: 'failed' }),
		[database],
	)
}

export function Quests() {
	const startQuest = useStartQuest()
	const completeQuest = useCompleteQuest()
	const failQuest = useFailQuest()
	const { database } = useGame()

	useEffect(() => {
		const unsubscribeStartQuest = eventBus.on('start_quest', ({ id, name }) => {
			startQuest({ id, name })
		})
		const unsubscribeCompleteQuest = eventBus.on('complete_quest', (id) => {
			completeQuest(id)
		})
		const unsubscribeFailQuest = eventBus.on('fail_quest', (id) => {
			failQuest(id)
		})
		const unsubscribeResetQuests = eventBus.on('reset_quests', () => {
			database.table<QuestRecord, string>('quests').clear()
		})

		return () => {
			unsubscribeStartQuest()
			unsubscribeCompleteQuest()
			unsubscribeFailQuest()
			unsubscribeResetQuests()
		}
	}, [startQuest, completeQuest, failQuest, database])

	return <></>
}
