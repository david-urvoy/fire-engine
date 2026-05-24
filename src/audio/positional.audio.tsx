import { PositionalAudio as DreiPositionalAudio } from '@react-three/drei'
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
	...props
}: Parameters<typeof DreiPositionalAudio>[0] & {
	rollOffFactor?: number
	maxDistance?: number
	distanceModel?: PositionalAudioDistanceModel
}) {
	const audioRef = useRef<PositionalAudioType>(null)
	const { isDebug } = useSnapshot(game)

	useEffect(() => {
		audioRef.current?.setRolloffFactor(rollOffFactor)
		audioRef.current?.setDistanceModel(distanceModel)
		audioRef.current?.setMaxDistance(maxDistance)
	}, [rollOffFactor, maxDistance, distanceModel])

	useEffect(() => {
		const audio = audioRef.current
		if (!isDebug || !audio) return

		const helper = new PositionalAudioHelper(audio, 1)
		audio.add(helper)

		return () => {
			audio.remove(helper)
			helper.dispose()
		}
	}, [isDebug])

	return <DreiPositionalAudio distance={distance} ref={audioRef} {...props} />
}
