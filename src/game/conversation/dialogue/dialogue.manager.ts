import type { Character } from '../../character/types/character'
import type { DialogueDefinition } from './dialogue'
import { NpcDialogue, PlayerDialogue } from './dialogue.model'
import { dialogueStore } from './dialogue.store'

type Dialogue<DialogueId extends string> = DialogueDefinition<Character<string>['id'], DialogueId>
type DialogueEndListener = () => void

export interface DialogueManager<DialogueId extends string = string> {
	get(id: DialogueId): NpcDialogue | PlayerDialogue
	has(id: DialogueId): boolean
	all(): Array<DialogueDefinition<string, DialogueId>>
	trigger(id: DialogueId): void
	subscribeOnDialogueEnd(dialogueId: DialogueId, listener: DialogueEndListener): () => void
}

export function createDialogueManager<DialogueId extends string>(
	source: Readonly<Record<DialogueId, Dialogue<DialogueId>>>,
): DialogueManager<DialogueId> {
	const onDialogueEndSubscribers = new Map<DialogueId, Set<DialogueEndListener>>()

	function createNpcDialogue(dialogue: Dialogue<DialogueId>) {
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
		dialogue: Dialogue<DialogueId>
		locked?: boolean
	}) {
		if (dialogueStore.active?.locked) return dialogueStore.active

		dialogueStore.active?.end()
		dialogueStore.active = new PlayerDialogue({
			dialogue,
			locked,
			onEnd: (endedDialogue) => {
				const dialogueId = endedDialogue.id as DialogueId
				onDialogueEndSubscribers.get(dialogueId)?.forEach((subscriber) => subscriber())
			},
		})
		return dialogueStore.active
	}

	return {
		get(id) {
			const dialogue =
				dialogueStore.active?.id === id
					? dialogueStore.active
					: dialogueStore.all.find((dialogue) => dialogue?.id === id)
			if (!dialogue) throw new Error(`Dialogue with id "${id}" not found in repository`)
			return dialogue
		},
		has(id) {
			return id in source
		},
		all() {
			return Object.values(source)
		},
		trigger(id) {
			const dialogue = source[id]
			if (!dialogue) throw new Error(`Dialogue with id "${id}" not found in repository`)

			if (dialogue.isNpcOnly) createNpcDialogue(dialogue)
			else createPlayerDialogue({ dialogue, locked: dialogue.locked })
		},
		subscribeOnDialogueEnd(dialogueId, listener) {
			let subscribers = onDialogueEndSubscribers.get(dialogueId)

			if (!subscribers) {
				subscribers = new Set<DialogueEndListener>()
				onDialogueEndSubscribers.set(dialogueId, subscribers)
			}

			subscribers.add(listener)

			return () => {
				const currentSubscribers = onDialogueEndSubscribers.get(dialogueId)
				if (!currentSubscribers) return

				currentSubscribers.delete(listener)
				if (currentSubscribers.size === 0) onDialogueEndSubscribers.delete(dialogueId)
			}
		},
	}
}
