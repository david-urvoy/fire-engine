import { useEffect } from 'react'

import { useEntity } from '../game'
import type { Animations } from './character-animation'

export function useBindAnimations(bindAnimations: () => Animations) {
	const { setRuntime } = useEntity()

	useEffect(() => setRuntime({ animations: bindAnimations() }), [setRuntime, bindAnimations])
}
