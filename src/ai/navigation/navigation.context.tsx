import {
	createContext,
	use,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type PropsWithChildren,
} from 'react'
import { NavMesh, NavMeshLoader } from 'yuka'

import type { PointOfInterest } from './point-of-interest'

type NavigationContextValue = {
	navMesh?: NavMesh
	setNavMeshSource: (source: string) => void
	pointsOfInterest: Record<string, PointOfInterest>
	addPointOfInterest: (pointOfInterest: PointOfInterest) => void
}

const NavigationContext = createContext<NavigationContextValue>({
	setNavMeshSource: () => {},
	pointsOfInterest: {},
	addPointOfInterest: () => {},
})

const navMeshCache = new Map<string, Promise<NavMesh>>()

export function NavigationProvider({ children }: PropsWithChildren) {
	const [source, setSource] = useState<string | null>(null)
	const [pointsOfInterest, setPointsOfInterest] = useState<Record<string, PointOfInterest>>({})

	const navMesh = source
		? use(navMeshCache.getOrInsertComputed(source, () => new NavMeshLoader().load(source)))
		: undefined

	const setNavMeshSource = useCallback((source: string) => setSource(source), [])

	const addPointOfInterest = useCallback(
		(pointOfInterest: PointOfInterest) =>
			setPointsOfInterest((prev) => ({
				...prev,
				[`${pointOfInterest.group}:${pointOfInterest.id}`]: pointOfInterest,
			})),
		[],
	)

	const value = useMemo(
		() => ({ navMesh, setNavMeshSource, pointsOfInterest, addPointOfInterest }),
		[navMesh, setNavMeshSource, pointsOfInterest, addPointOfInterest],
	)

	return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
	const context = useContext(NavigationContext)

	if (!context) {
		throw new Error('useNavigation must be used within a NavigationProvider')
	}

	return context
}

export function useLoadNavigation(navmesh: string) {
	const { setNavMeshSource } = useNavigation()
	useEffect(() => setNavMeshSource(navmesh), [navmesh, setNavMeshSource])
}
