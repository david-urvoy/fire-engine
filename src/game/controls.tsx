import { type RefObject, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { Gamepad, KeyboardControls, Keymap, keyboard, useSubscribeKey } from '../three'
import { game } from './game-store'

export function Controls() {
	const { mobile } = useSnapshot(keyboard.state)
	const { isMobile } = useSnapshot(game)

	// useFullscreen(canvas)

	useEffect(() => {
		if (mobile) game.isMobile = !game.isMobile
	}, [mobile])

	return isMobile ? <Gamepad /> : <KeyboardControls map={Keymap} />
}

export function useFullscreen(canvas: RefObject<HTMLDivElement | null>) {
	useSubscribeKey('KeyP', () => {
		if (document.fullscreenEnabled) return
		return !document.fullscreenElement ? canvas.current?.requestFullscreen() : document.exitFullscreen()
	})
}
