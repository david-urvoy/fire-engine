import { Vector3 } from 'three'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Vector3 as YukaVector3 } from 'yuka'

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
				rigidBody: null,
				object3D: null,
				animations: null,
			},
		})
	})

	describe('should set target and movement state', () => {
		it('should set target position', () => {
			const target = new YukaVector3(10, 0, 0)
			const speed = 0.5

			entity.moveTo(target, speed)

			expect(entity.controls.target).toEqual(target)
			expect(entity.controls.speed).toBe(speed)
		})

		it('should set isMoving to true', () => {
			const target = new YukaVector3(10, 0, 10)
			const speed = 0.5

			entity.moveTo(target, speed)

			expect(entity.controls.isMoving).toBe(true)
		})

		it('should handle negative target coordinates', () => {
			const target = new YukaVector3(-10, 0, -10)
			const speed = 0.8

			entity.moveTo(target, speed)

			expect(entity.controls.target).toEqual(target)
			expect(entity.controls.speed).toBe(speed)
			expect(entity.controls.isMoving).toBe(true)
		})
	})

	describe('Entity.moveBy', () => {
		it('should move entity by delta relative to current position', () => {
			const delta = new Vector3(5, 0, 5)
			const speed = 1

			entity.moveBy(delta, speed)

			// moveBy should calculate target as current position + delta
			// Since entity starts at origin (0,0,0), target should be at delta
			expect(entity.controls.target.x).toBe(delta.x)
			expect(entity.controls.target.y).toBe(delta.y)
			expect(entity.controls.target.z).toBe(delta.z)
			expect(entity.controls.speed).toBe(speed)
		})

		it('should be chainable', () => {
			const result = entity.moveBy(new Vector3(1, 0, 1))

			expect(result).toBe(entity)
		})
	})
})
