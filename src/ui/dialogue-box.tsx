import clsx from 'clsx'
import { useSnapshot } from 'valtio'
import { game } from '../game'

export const DialogueBox = () => {
	const { dialogue: gameDialogue } = useSnapshot(game)

	const dialogue = gameDialogue.active
	if (!dialogue || !dialogue.line) {
		game.pointerLockControls.current?.lock()
		return null
	} else {
		game.pointerLockControls.current?.unlock()
	}

	const { text, speakerId } = dialogue.line
	const choices = dialogue.choices

	return (
		<div
			className={clsx(
				'font-bebas pointer-events-auto cursor-default select-none',
				'flex flex-col items-center gap-4',
				'absolute bottom-12 left-1/2',
				'-translate-x-1/2 rounded-lg px-6 py-4 text-center text-3xl',
				'text-white backdrop-blur-sm',
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
