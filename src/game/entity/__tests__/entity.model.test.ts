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

	describe('should set target and movement state', () => {
		it('should set target position', () => {
			const target = new Vector3(10, 0, 0)
			const speed = 0.5

			entity.moveTo(target, speed)

			expect(entity.controls.target).toEqual(target)
			expect(entity.controls.speed).toBe(speed)
		})

		it('should set isMoving to true', () => {
			const target = new Vector3(10, 0, 10)
			const speed = 0.5

			entity.moveTo(target, speed)

			expect(entity.controls.isMoving).toBe(true)
		})

		it('should handle negative target coordinates', () => {
			const target = new Vector3(-10, 0, -10)
			const speed = 0.8

			entity.moveTo(target, speed)

			expect(entity.controls.target).toEqual(target)
			expect(entity.controls.speed).toBe(speed)
			expect(entity.controls.isMoving).toBe(true)
		})
	})

	describe('Entity.moveBy', () => {
		it('should move entity by delta relative to current position', () => {
			const delta: [number, number, number] = [5, 0, 5]
			const speed = 1

			entity.moveBy(delta, speed)

			// moveBy should calculate target as current position + delta
			// Since entity starts at origin (0,0,0), target should be at delta
			expect(entity.controls.target.x).toBe(delta[0])
			expect(entity.controls.target.y).toBe(delta[1])
			expect(entity.controls.target.z).toBe(delta[2])
			expect(entity.controls.speed).toBe(speed)
		})

		it('should be chainable', () => {
			const result = entity.moveBy([1, 0, 1])

			expect(result).toBe(entity)
		})
	})
})
