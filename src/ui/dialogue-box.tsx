import { useThree } from '@react-three/fiber'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'
import { dialogueStore, game } from '../game'

export const DialogueBox = () => {
	const { active: dialogue } = useSnapshot(dialogueStore)

	if (!dialogue?.line) return null

	const { text, speakerId } = dialogue.line
	const isLockedDialogue = !!dialogue.locked
	const choices = dialogue.choices

	return (
		<div
			id="dialogue-box"
			className={clsx(
				isLockedDialogue ? 'pointer-events-auto' : 'pointer-events-none',
				'cursor-default select-none',
				'flex flex-col items-center gap-4',
				'rounded-lg px-6 py-4 text-center text-3xl',
				'font-bebas text-white backdrop-blur-sm',
			)}
		>
			<p>
				{speakerId.charAt(0).toUpperCase() + speakerId.slice(1)}: {text}
			</p>
			{isLockedDialogue && !!choices?.length && (
				<div className="flex gap-4">
					{choices.map((choice) => (
						<button
							className="underline hover:bg-amber-200"
							key={choice.label}
							onMouseUp={() => dialogueStore.active?.choose(choice)}
						>
							{choice.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export function DialogueEventBlocker() {
	const { events } = useThree()
	const previousModeRef = useRef<boolean | null>(null)
	const { isPaused } = useSnapshot(game)
	const { active: activeDialogue } = useSnapshot(dialogueStore)

	useEffect(() => {
		const syncEvents = () => {
			const isDialogueMode = !isPaused && !!activeDialogue?.locked
			events.enabled = !isDialogueMode

			if (previousModeRef.current !== null && previousModeRef.current !== isDialogueMode) {
				if (isDialogueMode) game.pointerLockControls.current?.unlock()
				else game.pointerLockControls.current?.lock()
			}

			previousModeRef.current = isDialogueMode
		}

		syncEvents()
	}, [events, isPaused, activeDialogue])

	return null
}
