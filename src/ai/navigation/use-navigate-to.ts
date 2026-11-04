import { useEffect, useMemo, useState } from 'react'

import type { Entity } from '../../game/entity/entity.model'
import { eventBus } from '../../lib'
import { useNavigation } from './navigation.context'

export function useNavigateTo<T extends string>(entity: Entity, pointOfInterest: T) {
	const [waypointIndex, setWaypointIndex] = useWaypointIndex(pointOfInterest)
	const path = usePath(entity, pointOfInterest)

	const currentWaypoint = path?.[waypointIndex]

	useEffect(() => {
		if (!currentWaypoint) return

		entity.moveTo(currentWaypoint, 1)
		entity.lookAt(currentWaypoint)
	}, [currentWaypoint, entity])

	useEffect(() => {
		if (!path) return

		const listener = ({ id }: { id: string }) => {
			if (id === entity.id) {
				if (waypointIndex < path.length - 1) {
					setWaypointIndex((prev) => prev + 1)
				} else {
					entity.controls.isMoving = false
				}
			}
		}

		eventBus.on('hasReached', listener)

		return () => eventBus.off('hasReached', listener)
	}, [waypointIndex, setWaypointIndex, path, entity.id, entity.controls])
}

function usePath<T extends string>(entity: Entity, pointOfInterest: T) {
	const { pathfinding, pointsOfInterest } = useNavigation()
	const targetPointOfInterest = pointsOfInterest[pointOfInterest]
	if (!targetPointOfInterest) console.warn(`POI key "${pointOfInterest}" not found in context`)

	const path = useMemo(
		() =>
			targetPointOfInterest
				? pathfinding.findPath(entity.position, targetPointOfInterest.position)
				: undefined,
		[targetPointOfInterest, pathfinding, entity.position],
	)

	return path
}

function useWaypointIndex(poi: string) {
	const [waypointIndex, setWaypointIndex] = useState(1)
	const [currentPoi, setCurrentPoi] = useState(poi)
	if (poi !== currentPoi) {
		setCurrentPoi(poi)
		setWaypointIndex(1)
	}

	return [waypointIndex, setWaypointIndex] as const
}
