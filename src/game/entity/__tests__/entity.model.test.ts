import { Vector3 } from 'three'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Entity } from '../entity.model'

vi.mock('../../../time', () => ({
	gameTime: {
		day: 0,
		hour: 0,
		minute: 0,
		GAME_SPEED: 1,
		_frozen: false,
		get frozen() {
			return this._frozen
		},
		freeze() {
			this._frozen = true
		},
		resume() {
			this._frozen = false
		},
	},
	useGameTime: () => {},
	Tweaks: { folder: () => ({ addBinding: () => ({ on: () => {} }) }) },
}))

describe('Entity.moveTo', () => {
	let entity: Entity

	beforeEach(async () => {
		entity = new Entity({
			id: 'test-entity',
			ref: 'test-ref',
			name: 'Test Entity',
			runtime: {
				rigidBody: {
					current: null,
				},
				object3D: { current: null },
				animations: { current: null },
			},
		})
	})

	describe('should move controls towards target', () => {
		it('should set move controls straight forward', () => {
			const target = new Vector3(10, 0, 0)
			const speed = 0.5

			entity.moveTo(target, speed)

			expect(entity.controls.move.x).toBe(0.5)
			expect(entity.controls.move.y).toBe(0)
			expect(entity.controls.move.z).toBe(0)
		})

		it('should set move controls diagonally', () => {
			const target = new Vector3(10, 0, 10)
			const speed = 0.5

			entity.moveTo(target, speed)

			const comp = Math.sqrt(0.5) * 0.5
			expect(entity.controls.move.x).toBeCloseTo(comp)
			expect(entity.controls.move.y).toBe(0)
			expect(entity.controls.move.z).toBeCloseTo(comp)
		})

		it('should set move controls straight backward', () => {
			const target = new Vector3(-10, 0, 0)
			const speed = 0.5

			entity.moveTo(target, speed)

			expect(entity.controls.move.x).toBe(-0.5)
			expect(entity.controls.move.y).toBe(0)
			expect(entity.controls.move.z).toBe(0)
		})
	})

	it('should return true when distance is less than POSITION_EPSILON', () => {
		const target = new Vector3(0.0001, 0, 0)
		const speed = 1

		const result = entity.moveTo(target, speed)

		expect(result).toBe(true)
	})

	it('should return false when distance is greater than POSITION_EPSILON', () => {
		const target = new Vector3(100, 0, 100)
		const speed = 0.1

		const result = entity.moveTo(target, speed)

		expect(result).toBe(false)
	})
})
