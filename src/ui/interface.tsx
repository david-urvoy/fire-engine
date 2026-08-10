import { DialogueBox, game, PauseMenu, Reticle } from '@david-urvoy/fire-engine'
import clsx from 'clsx'
import { type PropsWithChildren } from 'react'
import { useSnapshot } from 'valtio'

export function Interface({ children }: PropsWithChildren) {
	return (
		<div className="pointer-events-none fixed top-0 left-0 z-50 h-full w-full">
			<PauseMenu />
			<Reticle />
			<InteractableLabel />
			<DialogueBox />
			<DebugUI />
			{children}
		</div>
	)
}

function DebugUI() {
	const { debug } = useSnapshot(game)

	if (Object.entries(debug).length === 0) return null

	return (
		<div className="absolute top-20 right-1/4 text-amber-300 text-shadow-[-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black]">
			{JSON.stringify(debug)}
		</div>
	)
}

function InteractableLabel() {
	const { activeInteractable } = useSnapshot(game)

	return (
		<div
			className={clsx(
				'pointer-events-auto absolute select-none',
				'bottom-24 left-1/2 -translate-x-1/2',
				'rounded-lg px-6 py-2 text-center',
				'font-bebas text-3xl text-white backdrop-blur-sm transition-opacity duration-200',
				activeInteractable ? 'bg-black/40 opacity-100' : 'opacity-0',
			)}
		>
			{activeInteractable}
		</div>
	)
}
