import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import type { AnimationAction } from 'three'

import { useEntity } from '../game'

type Action = 'idle' | 'walk' | 'run'
const ACTIONS = {
	idle: {
		ratio: 0,
		maxSpeed: 0,
	},
	walk: {
		ratio: 50,
		maxSpeed: 0.1,
	},
	run: {
		ratio: 20,
		maxSpeed: Infinity,
	},
} as const
export type Animations = { [key in Action]: AnimationAction | null }

export function CharacterAnimation() {
	const { entity } = useEntity()
	const runningAnimation = useRef<AnimationAction | undefined>(null)

	const playAction = useCallback(
		(action: Action) => {
			const animation = entity.runtime.animations?.[action]
			if (animation !== runningAnimation.current) {
				runningAnimation.current?.stop()
				runningAnimation.current = animation
				animation?.play()
			}

			return animation
		},
		[entity.runtime.animations, runningAnimation],
	)

	useEffect(() => {
		playAction('idle')

		return () => {
			runningAnimation.current?.stop()
		}
	}, [playAction])

	useFrame(() => {
		const speed = entity.getSpeed()
		if (speed === 0) return playAction('idle')

		if (speed > ACTIONS.walk.maxSpeed)
			return playAction('run')?.setEffectiveTimeScale(speed * ACTIONS.run.ratio)
		else return playAction('walk')?.setEffectiveTimeScale(speed * ACTIONS.walk.ratio)
	})

	return <></>
}
