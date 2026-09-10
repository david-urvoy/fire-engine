import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import type { AnimationAction } from 'three'

import { useEntity } from '../game'

type Action = 'idle' | 'walk' | 'run'
const ACTIONS = {
	idle: {
		ratio: 0,
	},
	walk: {
		ratio: 0.5,
	},
	run: {
		ratio: 0.2,
	},
} as const
export type Animations = { [key in Action]: AnimationAction | null }

export function CharacterAnimation() {
	const { entity } = useEntity()
	const runningAnimation = useRef<AnimationAction | undefined>(null)

	const playAction = useCallback(
		(action: Action) => {
			const animations = entity.runtime.animations
			const animation = animations.current?.[action]

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
		const velocity = entity.velocity?.length()
		if (!velocity || velocity < 0.1) {
			playAction('idle')
			return
		}
		if (velocity > 0.8) playAction('run')?.setEffectiveTimeScale(velocity * ACTIONS.run.ratio)
		else playAction('walk')?.setEffectiveTimeScale(velocity * ACTIONS.walk.ratio)
	})

	return <></>
}
