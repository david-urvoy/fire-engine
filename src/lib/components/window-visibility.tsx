import { useEffect } from 'react'

import { game } from '../../game'
import { useWindowFocus } from '../hooks/window-focus.hook'

export function WindowVisibility() {
	const isFocused = useWindowFocus()

	useEffect(() => {
		if (!isFocused) game.pause()
	}, [isFocused])

	return null
}
