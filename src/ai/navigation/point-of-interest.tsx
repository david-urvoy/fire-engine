import { useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react'
import { Vector3 as YukaVector3 } from 'yuka'

import { useEntity } from '../../game'
import { useOnHasReached } from './movement'
import { useNavMesh } from './navmesh.context'

export type PointOfInterest<Group extends string = string> = {
	id: string
	name: string
	group: Group
	position: [number, number, number]
	radius: number
}

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

export function PointOfInterestNavigation({
	group,
	pointOfInterest,
}: {
	group: string
	pointOfInterest: string
}) {
	const { entity } = useEntity()
	const [waypointIndex, setWaypointIndex] = useState(1)
	const { navMesh, pointsOfInterest } = useNavMesh()

	const key = `${group}:${pointOfInterest}`
	const pointOfInterestRef = useRef(key)

	const targetPointOfInterest = pointsOfInterest[key]

	const path = useMemo(() => {
		if (!targetPointOfInterest || !navMesh) return undefined
		return navMesh.findPath(entity.position, new YukaVector3(...targetPointOfInterest.position))
	}, [targetPointOfInterest, navMesh, entity])

	useEffect(() => {
		if (key !== pointOfInterestRef.current) {
			pointOfInterestRef.current = key
			setWaypointIndex(1)
		}
	}, [key])

	useOnHasReached(() => {
		if (!path || !path[waypointIndex]) return null
		if (waypointIndex < path.length) {
			entity.controls.target.copy(path[waypointIndex])
			setWaypointIndex(waypointIndex + 1)
		} else entity.controls.setIsMoving(false)
	})

	return <></>
}
