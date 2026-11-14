import { useEffect, useMemo, useRef, type PropsWithChildren } from 'react'
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
	const waypointIndex = useRef(1)
	const { navMesh, pointsOfInterest } = useNavMesh()

	const key = `${group}:${pointOfInterest}`
	const pointOfInterestKey = useRef(key)

	const targetPointOfInterest = useMemo(() => pointsOfInterest[key], [pointsOfInterest, key])

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
