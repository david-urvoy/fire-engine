import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import type { AnimationAction } from 'three'

import { useEntity } from '../game'

type Action = 'idle' | 'walk' | 'run'
export type Animations = { [key in Action]: AnimationAction | null }

export function CharacterAnimation() {
	const { entity } = useEntity()
	const animations = entity.runtime.animations.current
	const runningAnimation = useRef<AnimationAction | undefined>(null)

	const playAction = useCallback(
		(action: Action) => {
			const animation = animations?.[action]

			if (animation !== runningAnimation.current) {
				runningAnimation.current?.stop()
				runningAnimation.current = animation
				animation?.play()
			}

			return animation
		},
		[animations, runningAnimation],
	)

	useEffect(() => {
		playAction('idle')

		return () => {
			runningAnimation.current?.stop()
		}
	}, [animations, playAction])

	useFrame(() => {
		const velocity = entity.velocity?.length()
		if (!velocity || velocity < 0.1) {
			playAction('idle')
			return
		}
		if (velocity > 0.8) playAction('run')?.setEffectiveTimeScale(velocity)
		else playAction('walk')?.setEffectiveTimeScale(velocity)
	})

	return <></>
}
