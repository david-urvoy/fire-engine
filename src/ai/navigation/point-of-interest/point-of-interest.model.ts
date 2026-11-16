export type PointOfInterest<Group extends string = string> = {
	id: string
	name: string
	group: Group
	position: [number, number, number]
	radius: number
}
