export type QuestEvents = {
	start_quest: { id: string; name: string }
	complete_quest: string
	fail_quest: string
	reset_quests: undefined
}
