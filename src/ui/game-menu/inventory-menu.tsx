import type { PropsWithChildren } from 'react'

export function InventoryMenu() {
	return (
		<ul className="fixed top-1/2 left-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 cursor-default grid-cols-5 gap-2 rounded-xs bg-blue-600 p-2">
			<InventoryItem>Item 1</InventoryItem>
			<InventoryItem>Item 2</InventoryItem>
			<InventoryItem>Item 3</InventoryItem>
			<InventoryItem>Item 4</InventoryItem>
			<InventoryItem>Item 5</InventoryItem>
			<InventoryItem>Item 6</InventoryItem>
			<InventoryItem>Item 7</InventoryItem>
			<InventoryItem>Item 8</InventoryItem>
			<InventoryItem>Item 9</InventoryItem>
			<InventoryItem>Item 10</InventoryItem>
		</ul>
	)
}

function InventoryItem({ children }: PropsWithChildren) {
	return <li className="bg-blue-300 hover:bg-amber-400">{children}</li>
}
