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

type NavMeshContextValue = {
	navMesh?: NavMesh
	setNavMeshSource: (source: string) => void
	pointsOfInterest: Record<string, PointOfInterest>
	addPointOfInterest: (pointOfInterest: PointOfInterest) => void
}

const NavMeshContext = createContext<NavMeshContextValue>({
	setNavMeshSource: () => {},
	pointsOfInterest: {},
	addPointOfInterest: () => {},
})

const navMeshCache = new Map<string, Promise<NavMesh>>()

export function NavMeshProvider({ children }: PropsWithChildren) {
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

	return <NavMeshContext.Provider value={value}>{children}</NavMeshContext.Provider>
}

export function useNavMesh() {
	const context = useContext(NavMeshContext)

	if (!context) {
		throw new Error('useNavMesh must be used within a NavMeshProvider')
	}

	return context
}

export function useLoadNavMesh(navmesh: string) {
	const { setNavMeshSource } = useNavMesh()
	useEffect(() => setNavMeshSource(navmesh), [navmesh, setNavMeshSource])
}
