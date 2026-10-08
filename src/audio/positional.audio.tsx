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
	distance = 2,
	maxDistance = 8,
	rollOffFactor = 1,
	distanceModel = 'inverse',
	volume = 1,
	...props
}: PositionalAudioProps & {
	volume?: number
	rollOffFactor?: number
	maxDistance?: number
	distanceModel?: PositionalAudioDistanceModel
}) {
	const audioRef = useRef<PositionalAudioType>(null)
	const { enabled: isDebugEnabled } = useSnapshot(game.debug)

	useEffect(() => {
		audioRef.current?.setRolloffFactor(rollOffFactor)
		audioRef.current?.setDistanceModel(distanceModel)
		audioRef.current?.setMaxDistance(maxDistance)
	}, [rollOffFactor, maxDistance, distanceModel])

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		audio.setVolume(volume)

		if (!isDebugEnabled) return

		const helper = new PositionalAudioHelper(audio, 1)
		audio.add(helper)

		return () => {
			audio.remove(helper)
			helper.dispose()
		}
	}, [isDebugEnabled, volume])

	return <DreiPositionalAudio distance={distance} ref={audioRef} {...props} />
}
