import { Vector3 } from 'three'

const DEFAULT_RADIUS = 0.5

export interface PointOfInterest {
	id: string
	name: string
	position: Vector3
	radius: number
}

export function PointOfInterest({
	id,
	name = id,
	position,
	radius = DEFAULT_RADIUS,
}: {
	id: string
	name?: string
	position: [number, number, number]
	radius?: number
}): PointOfInterest {
	return { id, name, position: new Vector3(...position), radius }
}
