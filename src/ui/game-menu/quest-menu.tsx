import { useQuests, type QuestRecord } from '../../game/quest/quest-store'

export function QuestMenu() {
	const quests = useQuests()

	if (!quests) return null

	return (
		<div className="flex flex-col text-white">
			Ongoing
			<QuestGroup quests={quests.filter((quest) => quest.status === 'ongoing')} />
			Completed
			<QuestGroup quests={quests.filter((quest) => quest.status === 'completed')} />
			Failed
			<QuestGroup quests={quests.filter((quest) => quest.status === 'failed')} />
		</div>
	)
}

function QuestGroup({ quests }: { quests: QuestRecord[] }) {
	return (
		<ul className="borderp-4 flex h-full flex-1 flex-col content-start gap-3 rounded-lg shadow-2xl backdrop-blur-sm">
			{quests?.map((quest) => (
				<QuestEntry key={quest.id} name={quest.name} />
			))}
		</ul>
	)
}

function QuestEntry({ name }: { name: string }) {
	return (
		<li className="rounded-sm border border-cyan-400/40 bg-linear-to-br from-slate-800 to-slate-900 p-1 transition-all duration-300 hover:border-pink-400/80 hover:shadow-lg hover:shadow-pink-500/50">
			<a className="text-center text-xs text-cyan-300 transition-colors duration-300 group-hover:text-pink-300">
				{name}
			</a>
		</li>
	)
}
