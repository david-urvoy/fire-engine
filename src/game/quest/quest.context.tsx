import { useEffect, type PropsWithChildren } from 'react'

import { eventBus } from '../../lib'
import { useGame } from '../game.context'
import { useCompleteQuest, useFailQuest, useStartQuest, type QuestRecord } from './quest-store'

export function QuestsProvider({ children }: PropsWithChildren) {
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

	return <>{children}</>
}
