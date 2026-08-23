import { useState } from 'react'

import type { DialogueDefinition } from '../dsl/dialogue-definition.type'
import { createDialogue } from './dialogue.model'

export type Dialogue = DialogueDefinition<string>

export function useDialogues(initialDialogues: Record<string, DialogueDefinition<string>>) {
	const [dialogues, setDialogues] = useState(initialDialogues)

	function trigger(dialogueId: string) {
		const dialogue = dialogues[dialogueId]
		if (!dialogue) throw new Error(`Dialogue with id "${dialogueId}" not found in context`)

		createDialogue(dialogue)
	}

	return { setDialogues, trigger }
}
