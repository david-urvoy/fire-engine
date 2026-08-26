import { useEffect } from 'react'

import { eventBus } from '../../../lib'
import { useCharacter } from '../../character/character.context'
import { useDialogues } from './dialogue.context'

export interface DialogueProps {
	resolver: () => string
}

export function Dialogues({ resolver }: DialogueProps) {
	const { trigger } = useDialogues()
	const {
		character: { id },
	} = useCharacter()

	useEffect(() => {
		const unsubscribe = eventBus.on('character_interacted', ({ characterId }) => {
			if (characterId !== id) return
			const dialogueId = resolver()
			trigger(dialogueId)
		})

		return () => unsubscribe()
	}, [id, trigger, resolver])

	return <></>
}
