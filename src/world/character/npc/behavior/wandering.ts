import { useEffect } from 'react'
import type { Vector3 } from 'three'
import { type Animations, animate } from '../../animation/animate'

export const useWanderingBehavior = (position: Vector3, animations?: Animations) => {
	animations && animate()(animations.walk)

	useEffect(() => {
		const sequence = setInterval(() => position.setX(position.x === 10 ? -10 : 10), 5000)
		return () => clearInterval(sequence)
	}, [position])
}
