import { useEffect, useMemo, useRef } from 'react'
import { Vector3 as YukaVector3 } from 'yuka'

import { useEntity } from '../../../game'
import { useOnHasReached } from '../movement'
import { useNavMesh } from '../navmesh.context'

export function PointOfInterestNavigation({
	group,
	pointOfInterest,
}: {
	group: string
	pointOfInterest: string
}) {
	const { entity } = useEntity()
	const waypointIndex = useRef(1)
	const { navMesh, pointsOfInterest } = useNavMesh()

	const key = `${group}:${pointOfInterest}`
	const pointOfInterestKey = useRef(key)

	const targetPointOfInterest = useMemo(
		() => pointsOfInterest[group]?.[pointOfInterest],
		[pointsOfInterest, group, pointOfInterest],
	)

	const path = useMemo(() => {
		if (!targetPointOfInterest || !navMesh) return undefined
		return navMesh.findPath(
			new YukaVector3(entity.position.x, entity.position.y, entity.position.z),
			new YukaVector3(...targetPointOfInterest.position),
		)
	}, [entity.position, navMesh, targetPointOfInterest])

	useEffect(() => {
		if (key !== pointOfInterestKey.current) {
			pointOfInterestKey.current = key
			waypointIndex.current = 1
		}
	}, [key])

	useEffect(() => {
		if (!path || !path[0]) return
		entity.controls.target.set(path[0].x, path[0].y, path[0].z)
	}, [path, entity.controls])

	useOnHasReached(() => {
		const waypoint = path?.[waypointIndex.current]
		if (!path || !waypoint) return null
		if (waypointIndex.current < path.length) {
			entity.controls.target.copy(waypoint)
			waypointIndex.current += 1
		} else entity.controls.setIsMoving(false)
	})

	return <></>
}
