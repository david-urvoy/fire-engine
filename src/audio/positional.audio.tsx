import { PositionalAudio as DreiPositionalAudio } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PositionalAudio as PositionalAudioType, Vector3 } from 'three'

import { game } from '../game'
import { useControlledCharacter } from '../game/character/controlled-character'

const tmpVec = new Vector3()

export function PositionalAudio({
	distance = 2,
	maxDistance = 8,
	rollOffFactor = 1,
	distanceModel = 'inverse',
	...props
}: Parameters<typeof DreiPositionalAudio>[0] & {
	rollOffFactor?: number
	maxDistance?: number
	distanceModel?: 'linear' | 'inverse' | 'exponential'
}) {
	const controlledCharacter = useControlledCharacter()
	const audioRef = useRef<PositionalAudioType>(null)

	useFrame(() => {
		if (!controlledCharacter) return

		const distance = audioRef.current
			?.getWorldPosition(tmpVec)
			.distanceTo(controlledCharacter.position)

		if (distance && distance > 8) audioRef.current?.setVolume(0)
		game.debug.distance = distance
	})

	useEffect(() => {
		audioRef.current?.setRolloffFactor(rollOffFactor)
		audioRef.current?.setDistanceModel(distanceModel)
		audioRef.current?.setMaxDistance(maxDistance)
	}, [rollOffFactor, maxDistance, distanceModel])

	return <DreiPositionalAudio distance={distance} ref={audioRef} {...props} />
}
