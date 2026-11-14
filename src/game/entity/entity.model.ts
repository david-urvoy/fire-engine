import { Quaternion, Vector3 } from 'three'
import { proxy } from 'valtio'
import { MovingEntity, Vector3 as YukaVector3 } from 'yuka'

import { INTERACTION_MAX_DISTANCE } from '../game.store'
import type { EntityRuntime, PhysicState } from './entity.types'

class Controls {
	constructor(
		public target = new Vector3(),
		public speed = 1,
		public orientation = new Quaternion(),
		public teleport?: Vector3,
		public isMoving = false,
	) {}

	setIsMoving(isMoving: boolean) {
		this.isMoving = isMoving
	}

	setTeleport(target?: Vector3) {
		this.teleport = target?.clone()
	}
}

export class Entity {
	readonly id: string
	readonly name: string
	readonly position: Vector3
	readonly rotation: Quaternion
	readonly controls: Controls
	physic?: PhysicState
	readonly runtime: EntityRuntime

	private _proxy = new MovingEntity()
	private _quaternion = new Quaternion()

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
		this.id = id
		this.name = name
		this.position = new Vector3(...(initialPosition ?? [0, 0, 0]))
		this.controls = proxy(new Controls())
		this.rotation = new Quaternion()
		this.runtime = runtime
	}

	moveBy(delta: Vector3, speed = 1) {
		this.controls.target.copy(this.position).add(new Vector3(...delta))
		this.controls.speed = speed
		this.controls.isMoving = true
		return this
	}

	moveTo(target: Vector3, speed: number) {
		this.controls.target.copy(target)
		this.controls.speed = speed
		this.controls.isMoving = true
		return this
	}

	teleportTo(target: Vector3) {
		this.controls.teleport = target.clone()
		return this
	}

	distanceTo(target: Vector3) {
		return this.position.distanceTo(target)
	}

	isInRange(target: Vector3, maxDistance = INTERACTION_MAX_DISTANCE) {
		return this.distanceTo(target) <= maxDistance
	}

	get velocity() {
		return this._proxy.velocity
	}

	getSpeed() {
		return this._proxy.getSpeed()
	}

	lookAt(target: YukaVector3) {
		this._proxy.lookAt(target)
		this._quaternion.copy(this._proxy.rotation)
		this.rotation.slerp(this._quaternion, 0.1)
		return this
	}
}
