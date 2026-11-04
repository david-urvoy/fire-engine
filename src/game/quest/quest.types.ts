export type QuestStatus = 'ongoing' | 'completed' | 'failed'

export type QuestFlags = Record<string, boolean>

export type Quest<QuestId extends string = string> = {
	id: QuestId
	name: string
	status: QuestStatus
}
