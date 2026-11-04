import {
	createContext,
	use,
	useCallback,
	useContext,
	useState,
	type PropsWithChildren,
} from 'react'
import { NavMesh, NavMeshLoader } from 'yuka'

import { Pathfinding } from './pathfinding'

type NavigationContextValue = {
	pathfinding: Pathfinding
	loadNavMesh: (source: string) => void
}

const NavigationContext = createContext<NavigationContextValue>({
	pathfinding: new Pathfinding(),
	loadNavMesh: () => {},
})

const navMeshCache = new Map<string, Promise<NavMesh>>()

export function NavigationProvider({ children }: PropsWithChildren) {
	const [source, setSource] = useState<string | null>(null)

	const navMesh = source
		? use(navMeshCache.getOrInsert(source, new NavMeshLoader().load(source)))
		: undefined

	const loadNavMesh = useCallback((source: string) => setSource(source), [])

	return (
		<NavigationContext.Provider value={{ pathfinding: new Pathfinding(navMesh), loadNavMesh }}>
			{children}
		</NavigationContext.Provider>
	)
}

export function useNavigation() {
	const context = useContext(NavigationContext)

	if (!context) {
		throw new Error('useNavigation must be used within a NavigationProvider')
	}

	return context
}
