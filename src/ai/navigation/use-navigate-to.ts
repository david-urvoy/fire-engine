import { useEffect, useMemo, useState } from 'react'
import { Vector3 as YukaVector3 } from 'yuka'

import type { Entity } from '../../game/entity/entity.model'
import { eventBus } from '../../lib'
import { useNavigation } from './navigation.context'

export function useNavigateTo(entity: Entity, group: string, pointOfInterest: string) {
	const [waypointIndex, setWaypointIndex] = useWaypointIndex(group, pointOfInterest)
	const path = usePath(entity, group, pointOfInterest)

	const currentWaypoint = path?.[waypointIndex]

	useEffect(() => {
		if (!currentWaypoint) return

		entity.moveTo(currentWaypoint, 1.6)
		entity.lookAt(currentWaypoint)
	}, [currentWaypoint, entity])

	useEffect(() => {
		if (!path) return

		const listener = ({ id }: { id: string }) => {
			if (id === entity.id)
				if (waypointIndex < path.length - 1) setWaypointIndex((prev) => prev + 1)
				else entity.controls.isMoving = false
		}

		eventBus.on('hasReached', listener)

		return () => eventBus.off('hasReached', listener)
	}, [waypointIndex, setWaypointIndex, path, entity.id, entity.controls])
}

function usePath(entity: Entity, group: string, pointOfInterest: string) {
	const { navMesh, pointsOfInterest } = useNavigation()
	const key = `${group}:${pointOfInterest}`
	const targetPointOfInterest = pointsOfInterest[key]

	const path = useMemo(() => {
		return targetPointOfInterest
			? navMesh?.findPath(entity.position, new YukaVector3(...targetPointOfInterest.position))
			: undefined
	}, [targetPointOfInterest, navMesh, entity])

	return path
}

function useWaypointIndex(group: string, pointOfInterest: string) {
	const [waypointIndex, setWaypointIndex] = useState(1)
	const [currentPoi, setCurrentPoi] = useState(`${group}:${pointOfInterest}`)
	const key = `${group}:${pointOfInterest}`
	if (key !== currentPoi) {
		setCurrentPoi(key)
		setWaypointIndex(1)
	}

	return [waypointIndex, setWaypointIndex] as const
}
