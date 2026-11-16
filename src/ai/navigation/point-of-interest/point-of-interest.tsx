import { useEffect, type PropsWithChildren } from 'react'

import { useNavMesh } from '../navmesh.context'
import type { PointOfInterest } from './point-of-interest.model'

export function PointOfInterest<Group extends string = string>({
	id,
	name,
	group,
	position,
	radius,
	children,
}: PropsWithChildren<PointOfInterest<Group>>) {
	const { addPointOfInterest } = useNavMesh()
	useEffect(
		() => addPointOfInterest({ id, name, group, position, radius }),
		[id, name, group, position, radius, addPointOfInterest],
	)

	return <group position={position}>{children}</group>
}
