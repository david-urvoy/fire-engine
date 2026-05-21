import { useEffect } from 'react'
import { eventBus } from '../../../lib'
import { useCharacter } from '../../character/character.context'
import { useGame } from '../../game.context'

export function Dialogues({ resolver }: { resolver: () => string | undefined }) {
	const { dialogueManager } = useGame()
	const { id } = useCharacter()

	useEffect(() => {
		const unsubscribe = eventBus.on('character_interacted', ({ characterId }) => {
			if (characterId === id) {
				const dialogueId = resolver()
				if (!dialogueId) return

				dialogueManager.trigger(dialogueId)
			}
		})

		return () => {
			unsubscribe()
		}
	}, [id, dialogueManager, resolver])

	return <></>
}
