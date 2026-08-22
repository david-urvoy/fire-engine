import { useEffect } from 'react'

import { eventBus } from '../../../lib'
import { useCharacter } from '../../character/character.context'
import type { DialogueDefinition } from '../dsl/dialogue-definition.type'
import { useDialogues } from './use-dialogues'

export interface DialogueProps {
	dialogues: Record<string, DialogueDefinition<string>>
	resolver: () => string
}

export function Dialogues({ dialogues, resolver }: DialogueProps) {
	const { trigger } = useDialogues(dialogues)
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
