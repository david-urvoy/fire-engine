import { useEffect } from 'react'

import { useEntity } from '../game'
import type { Animations } from './character-animation'

export function useBindAnimations(bindAnimations: () => Animations) {
	const { setRuntime } = useEntity()

	useEffect(
		() => setRuntime({ animationsRef: { current: bindAnimations() } }),
		[setRuntime, bindAnimations],
	)
}
