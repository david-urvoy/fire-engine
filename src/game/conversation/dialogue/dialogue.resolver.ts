import { useEffect } from 'react'
import { eventBus } from '../../../lib'

export function useDialogueResolver({
	characterId: id,
	onSubscribe,
}: {
	characterId: string
	onSubscribe: () => void
}) {
	useEffect(() => {
		const unsubscribe = eventBus.on('character_interacted', ({ characterId }) => {
			if (characterId === id) onSubscribe()
		})

		return () => {
			unsubscribe()
		}
	}, [id, onSubscribe])
}
