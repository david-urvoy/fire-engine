import {
	createContext,
	useCallback,
	useContext,
	useState,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
} from 'react'

import type { DialogueDefinition, QuestDialogueDefinition } from '../dsl/dialogue-definition.type'
import { createDialogue } from './dialogue.model'

const DialogueContext = createContext<{
	standardDialogues: Record<string, DialogueDefinition<string>>
	setStandardDialogues: Dispatch<SetStateAction<Record<string, DialogueDefinition<string>>>>
	questExtensions: Map<string, QuestDialogueDefinition<string>>
	setQuestExtensions: Dispatch<SetStateAction<Map<string, QuestDialogueDefinition<string>>>>
} | null>(null)

const QuestExtensionContext = createContext<{
	register: (questId: string, definition: QuestDialogueDefinition<string>) => void
	unregister: (questId: string) => void
} | null>(null)

export function DialogueProvider({ children }: PropsWithChildren) {
	const [standardDialogues, setStandardDialogues] = useState<
		Record<string, DialogueDefinition<string>>
	>({})
	const [questExtensions, setQuestExtensions] = useState<
		Map<string, QuestDialogueDefinition<string>>
	>(new Map())

	const register = useCallback((questId: string, definition: QuestDialogueDefinition<string>) => {
		setQuestExtensions((prev) => {
			const next = new Map(prev)
			next.set(questId, definition)
			return next
		})
	}, [])

	const unregister = useCallback((questId: string) => {
		setQuestExtensions((prev) => {
			const next = new Map(prev)
			next.delete(questId)
			return next
		})
	}, [])

	return (
		<DialogueContext.Provider
			value={{ standardDialogues, setStandardDialogues, questExtensions, setQuestExtensions }}
		>
			<QuestExtensionContext.Provider value={{ register, unregister }}>
				{children}
			</QuestExtensionContext.Provider>
		</DialogueContext.Provider>
	)
}

function mergeQuestExtensions(
	dialogue: DialogueDefinition<string>,
	questExtensions: Map<string, QuestDialogueDefinition<string>>,
): DialogueDefinition<string> {
	if (questExtensions.size === 0) return dialogue

	const entryNode = dialogue.nodes[dialogue.entryNodeId]
	if (!entryNode?.choice || entryNode.choice.type !== 'extensible') return dialogue

	const entryNodeSpeakerIds = new Set(entryNode.lines.map((line) => line.speakerId))

	const questOptions = Array.from(questExtensions.values())
		.map((ext) => ext.option)
		.filter((option) => entryNodeSpeakerIds.has(option.speakerId))

	const mergedNodes = Array.from(questExtensions.values()).reduce(
		(acc, ext) => ({
			...ext.nodes,
			...acc,
		}),
		dialogue.nodes,
	)

	return {
		...dialogue,
		nodes: {
			...mergedNodes,
			[dialogue.entryNodeId]: {
				...entryNode,
				choice: {
					...entryNode.choice,
					options: [...entryNode.choice.options, ...questOptions],
				},
			},
		},
	}
}

export function useDialogues() {
	const context = useContext(DialogueContext)

	const trigger = useCallback(
		(dialogueId: string) => {
			if (!context) throw new Error('useDialogues must be used inside DialogueProvider')
			const dialogue = context.standardDialogues[dialogueId]
			if (!dialogue) throw new Error(`Dialogue with id "${dialogueId}" not found in context`)

			const mergedDialogue = mergeQuestExtensions(dialogue, context.questExtensions)
			createDialogue(mergedDialogue)
		},
		[context],
	)

	return {
		trigger,
		setStandardDialogues: context?.setStandardDialogues,
	}
}

export function useQuestExtension() {
	const context = useContext(QuestExtensionContext)
	if (!context) throw new Error('useQuestExtension must be used inside DialogueProvider')

	return context
}
