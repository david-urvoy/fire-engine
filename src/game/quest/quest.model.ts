export type QuestStatus = 'inactive' | 'active' | 'completed' | 'failed'

export type QuestFlags = Record<string, boolean>

export type Quest<Flags extends QuestFlags = QuestFlags> = {
	id: string
	flags: Flags
}

export type QuestState<QuestId extends string = string> = {
	id: QuestId
	status: QuestStatus
}

export type QuestStore<QuestId extends string = string> = {
	activeQuestIds?: QuestId[]
	quests?: Record<QuestId, QuestState<QuestId>>
	complete(id: QuestId): void
	fail(id: QuestId): void
	activate(id: QuestId): void
}
