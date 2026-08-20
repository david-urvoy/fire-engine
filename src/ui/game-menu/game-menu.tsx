import { useState } from 'react'
import { useSnapshot } from 'valtio'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '#design/components/tabs'

import { game } from '../../game'
import { InventoryMenu } from './inventory-menu'
import { QuestMenu } from './quest-menu'

const TABS = { inventory: 'inventory', quests: 'quests' } as const

export function GameMenu() {
	const { isOpen } = useSnapshot(game.gameMenu)
	const [selectedTab, selectTab] = useState(TABS.inventory)

	if (!isOpen) return null

	return (
		<div className="z-10 flex h-full w-full flex-col border-cyan-400/50 p-8 pt-24">
			<Tabs
				defaultValue={selectedTab}
				onValueChange={selectTab}
				className="pointer-events-auto flex flex-1 flex-col bg-slate-900"
			>
				<TabsList>
					<TabsTrigger value={TABS.inventory} className="text-sm font-bold text-cyan-300 uppercase">
						INVENTORY
					</TabsTrigger>
					<TabsTrigger value={TABS.quests} className="text-sm font-bold text-cyan-300 uppercase">
						QUESTS
					</TabsTrigger>
				</TabsList>
				<TabsContent value={TABS.inventory}>
					<InventoryMenu />
				</TabsContent>
				<TabsContent value={TABS.quests}>
					<QuestMenu />
				</TabsContent>
			</Tabs>
		</div>
	)
}
