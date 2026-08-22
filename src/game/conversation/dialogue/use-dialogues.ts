import { useState } from 'react'

import { eventBus } from '../../../lib'
import type { DialogueDefinition } from '../dsl/dialogue-definition.type'
import { NpcDialogue, PlayerDialogue } from './dialogue.model'
import { dialogueStore } from './dialogue.store'

export type Dialogue = DialogueDefinition<string>

export function useDialogues(initialDialogues: Record<string, DialogueDefinition<string>>) {
	const [dialogues, setDialogues] = useState(initialDialogues)

	function createNpcDialogue(dialogue: Dialogue) {
		const currentNpcDialogue = dialogueStore.all.find(({ id }) => dialogue.id === id)
		if (currentNpcDialogue) return currentNpcDialogue

		const instance = new NpcDialogue(dialogue)
		dialogueStore.all.push(instance)
		return instance
	}

	function createPlayerDialogue({
		dialogue,
		locked = true,
	}: {
		dialogue: Dialogue
		locked?: boolean
	}) {
		if (dialogueStore.active?.locked) return dialogueStore.active

		dialogueStore.active?.end()
		dialogueStore.active = new PlayerDialogue({
			dialogue,
			locked,
			onEnd: () => eventBus.emit('dialogue_ended', { dialogueId: dialogue.id }),
		})
		return dialogueStore.active
	}

	function trigger(dialogueId: string) {
		const dialogue = dialogues[dialogueId]
		if (!dialogue) throw new Error(`Dialogue with id "${dialogueId}" not found in context`)

		if (dialogue.isNpcOnly) {
			createNpcDialogue(dialogue)
			eventBus.emit('dialogue_started', { dialogueId })
			return
		}

		const instance = createPlayerDialogue({ dialogue, locked: dialogue.locked })
		if (instance?.id === dialogueId) {
			eventBus.emit('dialogue_started', { dialogueId })
		}
	}

	return { setDialogues, trigger }
}
