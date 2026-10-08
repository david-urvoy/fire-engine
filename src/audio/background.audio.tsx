import { useEffect, useRef, type JSX } from 'react'
import { useSnapshot } from 'valtio'

import { game } from '../game'

export function BackgroundAudio({ ...props }: JSX.IntrinsicElements['audio']) {
	const { isPaused, audio } = useSnapshot(game)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (!audioRef.current) return

		audioRef.current.volume = audio.isMuted ? 0 : audio.music.volume
	}, [audio.isMuted, audio.music.volume])

	useEffect(() => {
		if (isPaused) audioRef.current?.pause()
		else audioRef.current?.play()
	}, [isPaused])

	return <audio ref={audioRef} hidden {...props} />
}
