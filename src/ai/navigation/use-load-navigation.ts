import { useEffect } from 'react'

import type { NavigationConfig } from './navigation.config'
import { useNavigation } from './navigation.context'
import type { PointOfInterest } from './point-of-interest'

export function useLoadNavigation<T extends Record<string, PointOfInterest>>(
	config: NavigationConfig<T>,
) {
	const { setNavMeshSource, addPointsOfInterest } = useNavigation()

	useEffect(() => {
		setNavMeshSource(config.source)
		addPointsOfInterest(config.pointsOfInterest)
	}, [config.source, config.pointsOfInterest, setNavMeshSource, addPointsOfInterest])
}
