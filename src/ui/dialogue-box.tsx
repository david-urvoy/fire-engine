import clsx from 'clsx'
import { useSnapshot } from 'valtio'
import { game } from '../game'

export const DialogueBox = () => {
	const { activeDialogue } = useSnapshot(game).dialogue

	if (!activeDialogue) return null

	return (
		<div
			className={clsx(
				'font-bebas pointer-events-auto',
				'absolute bottom-12 left-1/2',
				'-translate-x-1/2 rounded-lg px-6 py-4 text-center text-3xl',
				'text-white backdrop-blur-sm',
			)}
		>
			{activeDialogue.nodes[activeDialogue.currentNodeId]?.lines[0] || '...'}
		</div>
	)
}
