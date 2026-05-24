import { useEffect, useRef, type JSX } from 'react'
import { useSnapshot } from 'valtio'

import { game } from '../game'

export function BackgroundAudio({
	volume = 1,
	...props
}: { volume?: number } & JSX.IntrinsicElements['audio']) {
	const { isPaused } = useSnapshot(game)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (!audioRef.current) return

		audioRef.current.volume = volume
	}, [volume])

	useEffect(() => {
		if (isPaused) audioRef.current?.pause()
		else audioRef.current?.play()
	}, [isPaused])

	return <audio ref={audioRef} hidden {...props} />
}
