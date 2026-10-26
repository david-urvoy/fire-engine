import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react'

import {
	isDialogueDefinition,
	type DialogueDefinition,
	type QuestDialogueDefinition,
} from '../dsl/dialogue-definition.type'

const DialogueContext = createContext<{
	dialogues: Set<DialogueDefinition<string>>
	questExtensions: Set<QuestDialogueDefinition<string>>
	register: (definition: DialogueDefinition<string> | QuestDialogueDefinition<string>) => void
	unregister: (definition: DialogueDefinition<string> | QuestDialogueDefinition<string>) => void
} | null>(null)

const QuestExtensionContext = createContext<{} | null>(null)

export function DialogueProvider({ children }: PropsWithChildren) {
	const [dialogues, setDialogues] = useState<Set<DialogueDefinition<string>>>(new Set())
	const [questExtensions, setQuestExtensions] = useState<Set<QuestDialogueDefinition<string>>>(
		new Set(),
	)

	const register = useCallback(
		(definition: DialogueDefinition<string> | QuestDialogueDefinition<string>) => {
			if (isDialogueDefinition(definition)) setDialogues((prev) => prev.add(definition))
			else setQuestExtensions((prev) => prev.add(definition))
		},
		[],
	)

	const unregister = useCallback(
		(definition: DialogueDefinition<string> | QuestDialogueDefinition<string>) => {
			if (isDialogueDefinition(definition))
				setDialogues((prev) => {
					prev.delete(definition)
					return prev
				})
			else
				setQuestExtensions((prev) => {
					prev.delete(definition)
					return prev
				})
		},
		[],
	)

	return (
		<DialogueContext.Provider value={{ dialogues, questExtensions, register, unregister }}>
			<QuestExtensionContext.Provider value={{ register, unregister }}>
				{children}
			</QuestExtensionContext.Provider>
		</DialogueContext.Provider>
	)
}

export function useDialogue() {
	const context = useContext(DialogueContext)
	if (!context) throw new Error('useDialogue must be used inside DialogueProvider')

	return context
}
