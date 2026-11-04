import { useNavigation } from './navigation.context'

export function useNavMesh(source: string) {
	const { loadNavMesh } = useNavigation()
	loadNavMesh(source)
}
