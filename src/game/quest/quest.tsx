import { type PropsWithChildren, useEffect } from 'react'

import { eventBus } from '../../lib'
import { useDialogue } from '../conversation/dialogue/dialogue.context'
import type { QuestDialogueDefinition } from '../conversation/dsl/dialogue-definition.type'

interface QuestProps {
	id: string
	name: string
	definition?: QuestDialogueDefinition<string>
	autostart?: boolean
}

export function Quest({
	id,
	name,
	definition,
	children,
	autostart = false,
}: PropsWithChildren<QuestProps>) {
	const { register, unregister } = useDialogue()

	useEffect(() => {
		if (!definition) return

		register(definition)

		return () => unregister(definition)
	}, [id, definition, register, unregister])

	useEffect(() => {
		if (autostart) eventBus.emit('start_quest', { id, name })
	}, [id, name, autostart])

	return <>{children}</>
}
