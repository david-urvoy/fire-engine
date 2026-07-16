type DialogueLike = {
	id: string
	entryNodeId: string
	participants: readonly { id: string }[]
	nodes: Record<
		string,
		{
			id: string
			lines: { id: string; speakerId: string; text: string }[]
			choice?: { id: string; label: string; nextNodeId: string }[]
			nextNodeId?: string
		}
	>
}

function isDialogue(value: unknown): value is DialogueLike {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
	const obj = value as Record<string, unknown>
	return (
		typeof obj.id === 'string' &&
		typeof obj.entryNodeId === 'string' &&
		Array.isArray(obj.participants) &&
		typeof obj.nodes === 'object' &&
		obj.nodes !== null
	)
}

export function collectDialoguesFromExports(
	source: Record<string, unknown>,
): Record<string, DialogueLike> {
	const dialogues: Record<string, DialogueLike> = {}

	const addDialogue = (dialogue: DialogueLike, exportName: string) => {
		if (dialogues[dialogue.id]) {
			throw new Error(
				`Duplicate dialogue id "${dialogue.id}" detected while processing export "${exportName}".`,
			)
		}

		dialogues[dialogue.id] = dialogue
	}

	for (const [exportName, exportValue] of Object.entries(source)) {
		if (isDialogue(exportValue)) {
			addDialogue(exportValue, exportName)
			continue
		}

		// Check if it's a record object containing dialogues
		if (typeof exportValue === 'object' && exportValue !== null && !Array.isArray(exportValue)) {
			for (const candidateValue of Object.values(exportValue)) {
				if (isDialogue(candidateValue)) {
					addDialogue(candidateValue, exportName)
				}
			}
		}
	}

	return dialogues
}

export function validateDialogue(dialogue: DialogueLike): void {
	if (!dialogue.id) {
		throw new Error('A dialogue has an empty "id".')
	}

	if (!dialogue.nodes[dialogue.entryNodeId]) {
		throw new Error(
			`Dialogue "${dialogue.id}" has an unknown entry node "${dialogue.entryNodeId}".`,
		)
	}

	const participantIds = new Set(dialogue.participants.map((participant) => participant.id))

	for (const [nodeId, node] of Object.entries(dialogue.nodes)) {
		if (!Array.isArray(node.lines)) {
			throw new Error(`Dialogue "${dialogue.id}" node "${nodeId}" has invalid "lines".`)
		}

		if (node.nextNodeId && !dialogue.nodes[node.nextNodeId]) {
			throw new Error(
				`Dialogue "${dialogue.id}" node "${nodeId}" points to unknown next node "${node.nextNodeId}".`,
			)
		}

		for (const option of node.choice ?? []) {
			if (!dialogue.nodes[option.nextNodeId]) {
				throw new Error(
					`Dialogue "${dialogue.id}" node "${nodeId}" choice "${option.id}" points to unknown next node "${option.nextNodeId}".`,
				)
			}
		}

		for (const line of node.lines) {
			if (!participantIds.has(line.speakerId)) {
				console.warn(
					`[dialogues:generate] Warning: dialogue "${dialogue.id}" line "${line.id}" uses speaker "${line.speakerId}" not declared in participants.`,
				)
			}
		}
	}
}

function sortObjectKeys<T>(record: Record<string, T>): Record<string, T> {
	return Object.keys(record)
		.sort((a, b) => a.localeCompare(b))
		.reduce<Record<string, T>>((acc, key) => {
			acc[key] = record[key] as T
			return acc
		}, {})
}

export function toStableDialogues(
	dialogues: Record<string, DialogueLike>,
): Record<string, DialogueLike> {
	const sortedDialogues = sortObjectKeys(dialogues)
	const result: Record<string, DialogueLike> = {}

	for (const [dialogueId, dialogue] of Object.entries(sortedDialogues)) {
		result[dialogueId] = {
			...dialogue,
			nodes: sortObjectKeys(dialogue.nodes),
		}
	}

	return result
}

export function compileDialoguesFromExports(
	source: Record<string, unknown>,
): Record<string, DialogueLike> {
	const dialogues = collectDialoguesFromExports(source)

	if (!Object.keys(dialogues).length) {
		throw new Error('No dialogue exports were found. Nothing to generate.')
	}

	for (const dialogue of Object.values(dialogues)) {
		validateDialogue(dialogue)
	}

	return toStableDialogues(dialogues)
}
