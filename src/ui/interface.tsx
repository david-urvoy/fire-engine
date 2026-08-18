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
		<div className="absolute bottom-0 whitespace-pre-wrap text-amber-300 text-shadow-[-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black]">
			{debug.enabled && JSON.stringify(debug.value, null, 2)}
		</div>
	)
}

function InteractableLabel() {
	const { active } = useSnapshot(game.interactable)

	return (
		<div
			className={clsx(
				'pointer-events-auto absolute select-none',
				'bottom-24 left-1/2 -translate-x-1/2',
				'rounded-lg px-6 py-2 text-center',
				'font-bebas text-3xl text-white backdrop-blur-sm transition-opacity duration-200',
				active ? 'bg-black/40 opacity-100' : 'opacity-0',
			)}
		>
			{active}
		</div>
	)
}
