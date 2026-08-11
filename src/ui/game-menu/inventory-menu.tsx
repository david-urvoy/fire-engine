import { type PropsWithChildren } from 'react'
import { useSnapshot } from 'valtio'

import { game, Items } from '../../game'

export function InventoryMenu() {
	const items = Items.useAll()

	const { isOpen } = useSnapshot(game.gameMenu)
	if (!isOpen) return null

	return (
		<ul className="fixed top-1/2 left-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 cursor-default grid-cols-5 gap-2 rounded-xs bg-blue-600 p-2">
			{items?.map((item) => (
				<InventoryItem key={item.id}>{item.id}</InventoryItem>
			))}
		</ul>
	)
}

function InventoryItem({ children }: PropsWithChildren) {
	return <li className="bg-blue-300 hover:bg-amber-400">{children}</li>
}
