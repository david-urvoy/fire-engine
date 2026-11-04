import { Vector3 } from 'three'
import { Vector3 as YUKAVector3, type NavMesh } from 'yuka'

export class Pathfinding {
	constructor(private navMesh?: NavMesh) {}

	findPath(from: Vector3, to: Vector3) {
		const start = new YUKAVector3(from.x, from.y, from.z)
		const end = new YUKAVector3(to.x, to.y, to.z)

		return this.navMesh
			?.findPath(start, end)
			?.map((point) => new Vector3(point.x, point.y, point.z))
	}
}
