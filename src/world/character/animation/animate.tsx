import type { ThreeElements } from '@react-three/fiber'
import type React from 'react'
import { type RefObject, useEffect, useRef } from 'react'
import type { AnimationAction } from 'three'
import { useSubscribePlayerMove } from '../../../controls'

type Actions = 'idle' | 'walk' | 'run'
export type Animations = { [key in Actions]: AnimationAction | null }
export interface Animated {
	animationsRef: RefObject<Animations | null>
}

export function Animate({
	Model,
	...props
}: {
	Model:
		| ((props: Animated) => React.JSX.Element)
		| React.LazyExoticComponent<({ animationsRef, ...props }: Animated) => React.JSX.Element>
} & ThreeElements['group']) {
	const animations = useRef<Animations>(null)
	const animation = useRef(animations.current?.idle)
	const direction = useSubscribePlayerMove()

	useEffect(() => {
		const action = direction.length() > 0 ? animations.current?.run : animations.current?.idle
		if (animation.current?.getClip().name !== action?.getClip().name) {
			animation.current?.stop()
			animation.current = action
			animation.current?.play()
		}
	}, [direction])

	return <Model {...props} animationsRef={animations} />
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
