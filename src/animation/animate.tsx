import { useEffect, useRef } from 'react'
import type { AnimationAction } from 'three'

type Actions = 'idle' | 'walk' | 'run'
export type Animations = { [key in Actions]: AnimationAction | null }

export function useAnimations(bindAnimations: () => Animations, moving?: boolean) {
	const animations = useRef<Animations>(null)
	const animation = useRef(animations.current?.idle)

	useEffect(() => {
		animations.current = bindAnimations()
		animation.current = animations.current?.idle
		animation.current?.play()

		return () => {
			animation.current?.stop()
		}
	}, [bindAnimations])

	useEffect(() => {
		const action = moving ? animations.current?.walk : animations.current?.idle

		if (action !== animation.current) {
			animation.current?.stop()
			animation.current = action
			animation.current?.play()
		}
	}, [moving])
}

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
