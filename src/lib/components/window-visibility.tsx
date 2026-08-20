import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { game } from '../../game'
import { isDev } from '../../settings'
import { pane, Tweaks, useAddBinding } from '../../ui'
import { useWindowFocus } from '../hooks/window-focus.hook'

export function WindowVisibility() {
	const isFocused = useWindowFocus()
	const {
		pointerLock: { isLocked: isPointerLocked },
	} = useSnapshot(game)

	const { keepOpen } = useAddBinding({
		folder: Tweaks.folder({ title: 'Debug' }),
		param: { keepOpen: false },
	})

	useEffect(() => {
		if (isDev) return
		if (!isFocused) game.pause()
	}, [isFocused])

	useEffect(() => {
		if (isPointerLocked) pane.expanded = false
	}, [isPointerLocked, keepOpen])

	return null
}
