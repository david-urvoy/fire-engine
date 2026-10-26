import { useEffect } from 'react'

import { eventBus } from '../../../lib'
import { useCharacter } from '../../character/character.context'
import type { DialogueDefinition } from '../dsl/dialogue-definition.type'
import { useDialogue } from './dialogue.context'
import { createDialogue } from './dialogue.model'

export interface DialogueProps {
	resolver: () => DialogueDefinition<string>
}

export function Dialogues({ resolver }: DialogueProps) {
	const { character } = useCharacter()
	const { questExtensions } = useDialogue()

	useEffect(() => {
		const unsubscribe = eventBus.on('character_interacted', ({ characterId }) => {
			if (characterId !== character.id) return
			const dialogue = resolver()
			createDialogue(structuredClone(dialogue), ...Array.from(questExtensions))
		})

		return () => unsubscribe()
	}, [character.id, resolver, questExtensions])

	return <></>
}
