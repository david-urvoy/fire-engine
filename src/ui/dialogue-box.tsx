import { useThree } from '@react-three/fiber'
import clsx from 'clsx'
import { useEffect } from 'react'
import { subscribe, useSnapshot } from 'valtio'
import { game } from '../game'

export const DialogueBox = () => {
	const {
		dialogue: { active: dialogue },
	} = useSnapshot(game)

	// useEffect(() => {
	// 	if (dialogue?.next()) game.pointerLockControls.current?.unlock()
	// 	else game.pointerLockControls.current?.lock()
	// }, [dialogue])

	if (!dialogue?.line) return null

	const { text, speakerId } = dialogue.line
	const choices = dialogue.choices

	return (
		<div
			id="dialogue-box"
			className={clsx(
				'pointer-events-auto cursor-default select-none',
				'flex flex-col items-center gap-4',
				'rounded-lg px-6 py-4 text-center text-3xl',
				'font-bebas text-white backdrop-blur-sm',
			)}
		>
			<p>
				{speakerId.charAt(0).toUpperCase() + speakerId.slice(1)}: {text}
			</p>
			<div className="flex gap-4">
				{choices?.map((choice) => (
					<button
						className="underline hover:bg-amber-200"
						key={choice.label}
						onMouseUp={() => game.dialogue.active?.choose(choice)}
					>
						{choice.label}
					</button>
				))}
			</div>
		</div>
	)
}

export function DialogueEventBlocker() {
	const { events } = useThree()

	useEffect(() => {
		return subscribe(game, () => {
			const blocksScene = game.uiMode === 'dialogue' && !game.dialogue.active?.awaitingChoice
			events.enabled = !blocksScene
		})
	}, [events])

	return null
}
