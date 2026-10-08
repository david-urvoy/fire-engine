import {
	PositionalAudio as DreiPositionalAudio,
	type PositionalAudioProps,
} from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { PositionalAudio as PositionalAudioType } from 'three'
import { PositionalAudioHelper } from 'three/addons/helpers/PositionalAudioHelper.js'
import { useSnapshot } from 'valtio'

import { game } from '../game'

type PositionalAudioDistanceModel = 'linear' | 'inverse' | 'exponential'

export function PositionalAudio({
	maxDistance = 8,
	rollOffFactor = 1,
	distanceModel = 'inverse',
	...props
}: PositionalAudioProps & {
	rollOffFactor?: number
	maxDistance?: number
	distanceModel?: PositionalAudioDistanceModel
}) {
	const audioRef = useRef<PositionalAudioType>(null)
	const {
		debug: { enabled: isDebugEnabled },
		audio: { voices, isMuted },
	} = useSnapshot(game)

	useEffect(() => {
		audioRef.current?.setRolloffFactor(rollOffFactor)
		audioRef.current?.setDistanceModel(distanceModel)
		audioRef.current?.setMaxDistance(maxDistance)
	}, [rollOffFactor, maxDistance, distanceModel])

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		audio.setVolume(isMuted ? 0 : voices.volume)

		if (!isDebugEnabled) return

		const helper = new PositionalAudioHelper(audio, 1)
		audio.add(helper)

		return () => {
			audio.remove(helper)
			helper.dispose()
		}
	}, [isDebugEnabled, voices.volume, isMuted])

	return <DreiPositionalAudio {...props} distance={voices.distance} ref={audioRef} />
}
