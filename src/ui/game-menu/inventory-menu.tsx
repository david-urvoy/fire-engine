import { Items } from '../../game'

export function InventoryMenu() {
	const items = Items.useAll()

	return (
		<ul className="grid h-full flex-1 grid-cols-4 content-start gap-3 rounded-lg border p-4 shadow-2xl backdrop-blur-sm">
			{items?.map((item) => (
				<InventoryItem key={item.id} id={item.id} name={item.name} image={item.image} />
			))}
		</ul>
	)
}

function InventoryItem({ id, name, image }: { id: string; name: string; image?: string }) {
	const dropItem = Items.useDelete(id)
	return (
		<li className="group flex cursor-pointer items-center justify-center rounded-sm border border-cyan-400/40 bg-linear-to-br from-slate-800 to-slate-900 p-1 transition-all duration-300 hover:border-pink-400/80 hover:shadow-lg hover:shadow-pink-500/50">
			<span
				className="truncate px-1 text-center text-xs text-cyan-300 transition-colors duration-300 group-hover:text-pink-300"
				onClick={dropItem}
			>
				{name}
				<img src={image} alt={name} className="rounded-sm" />
			</span>
		</li>
	)
}
