import { PointOfInterest } from './point-of-interest'

export type PointsOfInterest = Record<string, PointOfInterest>

export type NavigationConfig<T extends PointsOfInterest> = {
	source: string
	pointsOfInterest: T
}
