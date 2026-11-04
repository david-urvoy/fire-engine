import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import type { NavMesh } from 'yuka'
import { Vector3 as YUKAVector3 } from 'yuka'

import { Pathfinding } from '../pathfinding'
import { PointOfInterest } from '../point-of-interest'

describe('Pathfinding', () => {
	it('should return undefined if no navmesh is provided', () => {
		const pathfinding = new Pathfinding()
		const result = pathfinding.findPath(new Vector3(0, 0, 0), new Vector3(10, 0, 10))

		expect(result).toBeUndefined()
	})

	it('should convert Three.js Vector3 to Yuka Vector3 and return Three.js Vector3 array', () => {
		const mockNavMesh = {
			findPath: (from: YUKAVector3, to: YUKAVector3) => {
				return [
					new YUKAVector3(from.x, from.y, from.z),
					new YUKAVector3(5, 0, 5),
					new YUKAVector3(to.x, to.y, to.z),
				]
			},
		} as unknown as NavMesh

		const pathfinding = new Pathfinding(mockNavMesh)
		const result = pathfinding.findPath(new Vector3(0, 0, 0), new Vector3(10, 0, 10))

		expect(result).toBeDefined()
		expect(result).toHaveLength(3)
		expect(result![0]).toEqual(new Vector3(0, 0, 0))
		expect(result![1]).toEqual(new Vector3(5, 0, 5))
		expect(result![2]).toEqual(new Vector3(10, 0, 10))
	})
})

describe('PointOfInterest', () => {
	it('should create a PointOfInterest with default radius', () => {
		const poi = PointOfInterest({
			id: 'counter',
			position: [1, 2, 3],
		})

		expect(poi.id).toBe('counter')
		expect(poi.name).toBe('counter')
		expect(poi.position).toEqual(new Vector3(1, 2, 3))
		expect(poi.radius).toBe(0.5)
	})

	it('should accept custom name and radius', () => {
		const poi = PointOfInterest({
			id: 'bed_01',
			name: 'Bed',
			position: [4, 0, -2],
			radius: 1.2,
		})

		expect(poi.id).toBe('bed_01')
		expect(poi.name).toBe('Bed')
		expect(poi.position).toEqual(new Vector3(4, 0, -2))
		expect(poi.radius).toBe(1.2)
	})
})

