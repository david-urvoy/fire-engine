import { type PropsWithChildren, useEffect } from 'react'

import { eventBus } from '../../lib'
import type { QuestDialogueDefinition } from '../conversation'
import { useQuestExtension } from '../conversation/dialogue/dialogue.context'

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
	const { register, unregister } = useQuestExtension()

	useEffect(() => {
		if (!definition) return

		register(id, definition)

		return () => unregister(id)
	}, [id, definition, register, unregister])

	useEffect(() => {
		if (autostart) eventBus.emit('start_quest', { id, name })
	}, [id, name, autostart])

	return <>{children}</>
}
