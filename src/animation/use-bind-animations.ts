import { useEffect } from 'react'

import { useEntity } from '../game'
import type { Animations } from './character-animation'

export function useBindAnimations(bindAnimations: () => Animations) {
	const { entity } = useEntity()

	useEffect(() => {
		entity.runtime.animations.current = bindAnimations()
	}, [entity.runtime.animations, bindAnimations])
}
