import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { game } from '../../game'
import { isDev } from '../../settings'
import { useWindowFocus } from '../hooks/window-focus.hook'

export function WindowVisibility() {
	const isFocused = useWindowFocus()
	const { keepOpen } = useSnapshot(game.tweaks)

	useEffect(() => {
		if (isDev || keepOpen) return
		if (!isFocused) game.pause()
	}, [isFocused, keepOpen])

	return null
}
