// @ts-nocheck
import type React from 'react'
import { type RefObject, useEffect, useRef } from 'react'
import type { AnimationAction, Group } from 'three'
import { useSnapshot } from 'valtio'
import { keyboard } from '../../../../game/controls/actions/keyboard/keyboard.store'

type Actions = 'idle' | 'walk' | 'run'
export type Animations = { [key in Actions]: AnimationAction | null }
export interface Animated extends Group {
	animationsRef: RefObject<Animations | null>
}

export function Animate({
	Model,
	...props
}: {
	Model?: (props: Animated) => React.JSX.Element
	// | React.LazyExoticComponent<({ animationsRef, ...props }: Animated) => React.JSX.Element>
} & Partial<Animated>) {
	const animations = useRef<Animations>(null)
	const animation = useRef(animations.current?.idle)
	const { up, down, right, left } = useSnapshot(keyboard).state

	useEffect(() => {
		const action = up || down || right || left ? animations.current?.run : animations.current?.idle
		if (animation.current?.getClip().name !== action?.getClip().name) {
			animation.current?.stop()
			animation.current = action
			animation.current?.play()
		}
	}, [up, down, right, left])

	return Model && <Model {...props} animationsRef={animations} />
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
