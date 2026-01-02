import { useEffect, useRef } from 'react'
import type { AnimationAction } from 'three'
import { useSnapshot } from 'valtio'
import { keyboardKeys } from '../../../../game/controls/input/keyboard/keyboard.store'

type Actions = 'idle' | 'walk' | 'run'
export type Animations = { [key in Actions]: AnimationAction | null }

export function useAnimations(bindAnimations: () => Animations) {
	const animations = useRef<Animations>(null)
	const animation = useRef(animations.current?.idle)
	const { up, down, right, left } = useSnapshot(keyboardKeys)

	useEffect(() => {
		animations.current = bindAnimations()
		animation.current = animations.current?.idle
		animation.current?.play()
	}, [bindAnimations])

	const action = up || down || right || left ? animations.current?.run : animations.current?.idle

	if (animation.current?.getClip().name !== action?.getClip().name) {
		animation.current?.stop()
		animation.current = action
		animation.current?.play()
	}
}

export function animate() {
	let runningAnimation: AnimationAction | null | undefined
	return (action?: AnimationAction | null) => {
		if (!runningAnimation || runningAnimation.getClip().name !== action?.getClip().name) {
			runningAnimation?.stop()
			runningAnimation = action
			runningAnimation?.play()
		}
	}
}
