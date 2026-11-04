import {
	createContext,
	use,
	useCallback,
	useContext,
	useMemo,
	useState,
	type PropsWithChildren,
} from 'react'
import { NavMesh, NavMeshLoader } from 'yuka'

import { Pathfinding } from './pathfinding'
import type { PointOfInterest } from './point-of-interest'

type NavigationContextValue = {
	pathfinding: Pathfinding
	setNavMeshSource: (source: string) => void
	pointsOfInterest: Record<string, PointOfInterest>
	addPointsOfInterest: (points: Record<string, PointOfInterest>) => void
}

const NavigationContext = createContext<NavigationContextValue>({
	pathfinding: new Pathfinding(),
	setNavMeshSource: () => {},
	pointsOfInterest: {},
	addPointsOfInterest: () => {},
})

const navMeshCache = new Map<string, Promise<NavMesh>>()

export function NavigationProvider({ children }: PropsWithChildren) {
	const [source, setSource] = useState<string | null>(null)
	const [pointsOfInterest, setPointsOfInterest] = useState<Record<string, PointOfInterest>>({})

	const navMesh = source
		? use(navMeshCache.getOrInsertComputed(source, () => new NavMeshLoader().load(source)))
		: undefined

	const setNavMeshSource = useCallback((source: string) => setSource(source), [])

	const addPointsOfInterest = useCallback(
		(points: Record<string, PointOfInterest>) =>
			setPointsOfInterest((prev) => ({ ...prev, ...points })),
		[],
	)

	const pathfinding = useMemo(() => new Pathfinding(navMesh), [navMesh])

	const value = useMemo(
		() => ({ pathfinding, setNavMeshSource, pointsOfInterest, addPointsOfInterest }),
		[pathfinding, setNavMeshSource, pointsOfInterest, addPointsOfInterest],
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
