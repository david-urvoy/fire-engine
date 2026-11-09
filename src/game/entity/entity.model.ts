import { Vector3 } from 'three'
import { MovingEntity, Quaternion as YukaQuaternion, Vector3 as YukaVector3 } from 'yuka'

import { INTERACTION_MAX_DISTANCE } from '../game.store'
import type { EntityRuntime, PhysicState } from './entity.types'

class Controls {
	constructor(
		public target = new YukaVector3(),
		public speed = 1,
		public orientation = new YukaQuaternion(),
		public teleport?: YukaVector3,
		public isMoving = false,
	) {}

	setTeleport(target?: YukaVector3) {
		this.teleport = target?.clone()
	}
}

export class Entity extends MovingEntity {
	readonly id: string
	readonly controls: Controls
	physic?: PhysicState
	readonly runtime: EntityRuntime

	constructor({
		id,
		name = id,
		initialPosition,
		runtime,
	}: {
		id: string
		name?: string
		initialPosition?: [number, number, number]
		runtime: EntityRuntime
	}) {
		super()
		this.id = id
		this.name = name
		this.position = new YukaVector3(...(initialPosition ?? [0, 0, 0]))
		this.controls = new Controls()
		this.runtime = runtime
	}

	moveBy(delta: Vector3, speed = 1) {
		this.controls.target.copy(this.position).add(new YukaVector3(...delta))
		this.controls.speed = speed
		this.controls.isMoving = true
		return this
	}

	moveTo(target: YukaVector3, speed: number) {
		this.controls.target.copy(target)
		this.controls.speed = speed
		this.controls.isMoving = true
		return this
	}

	teleportTo(target: YukaVector3) {
		this.controls.teleport = target.clone()
		return this
	}

	distanceTo(target: YukaVector3) {
		return this.position.distanceTo(target)
	}

	isInRange(target: YukaVector3, maxDistance = INTERACTION_MAX_DISTANCE) {
		return this.distanceTo(target) <= maxDistance
	}
}
