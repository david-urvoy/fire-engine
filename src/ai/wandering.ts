import { useEffect } from 'react'
import type { AnimationAction, Vector3 } from 'three'

import type { Animations } from '../animation/character-animation'

export function animate() {
	let runningAnimation: AnimationAction | null = null
	return (action?: AnimationAction | null) => {
		if (action !== runningAnimation && action) {
			runningAnimation?.stop()
			runningAnimation = action
			runningAnimation?.play()
		}
	}
}

export const useWanderingBehavior = (position: Vector3, animations?: Animations) => {
	if (animations) animate()(animations.walk)

	useEffect(() => {
		const sequence = setInterval(() => position.setX(position.x === 10 ? -10 : 10), 5000)
		return () => clearInterval(sequence)
	}, [position])
}
