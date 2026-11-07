import { Euler, Matrix4, Quaternion, Vector3 } from 'three'

import { CameraProxy } from '../../camera/camera-proxy'
import { game, INTERACTION_MAX_DISTANCE, UP } from '../game.store'
import type { EntityRuntime, InteractionState, PhysicState } from './entity.types'

class Controls {
	constructor(
		public target: Vector3 = new Vector3(),
		public speed: number = 1,
		public orientation: Quaternion = new Quaternion(),
		public teleport?: Vector3,
		public isMoving: boolean = false,
	) {}
}

export class Entity {
	readonly id: string
	readonly name: string
	readonly controls: Controls
	physic?: PhysicState
	readonly runtime: EntityRuntime
	interaction?: InteractionState

	private _position = new Vector3()
	private _orientation = new Quaternion()
	private cameraProxy = CameraProxy

	constructor({
		id,
		name = id,
		runtime,
	}: {
		id: string
		name?: string
		initialPosition?: [number, number, number]
		runtime: EntityRuntime
	}) {
		this.id = id
		this.name = name
		this.controls = new Controls()
		this.runtime = runtime
		this.interaction = {
			isInteracting: false,
		}
	}

	moveBy(delta: [number, number, number], speed = 1) {
		this.controls.target.copy(this.position).add(new Vector3(...delta))
		this.controls.speed = speed
		return this
	}

	moveTo(target: Vector3, speed: number) {
		this.controls.target.copy(target)
		this.controls.speed = speed
		this.controls.isMoving = true
	}

	teleportTo(target: Vector3) {
		this.controls.teleport = target.clone()

		return this
	}

	lookAt(target: Vector3) {
		if (!this.physic || !this.position) return this

		const matrix = new Matrix4()
		matrix.lookAt(this.position, target.clone().setY(this.position.y), UP)
		this.controls.orientation.setFromRotationMatrix(matrix)

		return this
	}

	rotateBy(delta: [number, number, number]) {
		const euler = new Euler(...delta)
		const quaternion = new Quaternion().setFromEuler(euler)
		this.controls.orientation.copy(quaternion)
		return this
	}

	lookInDirection(direction: Vector3) {
		if (!direction) return this

		const x = -direction.x
		const z = -direction.z
		if (x !== 0 || z !== 0) {
			const yaw = Math.atan2(x, z)
			this.controls.orientation.setFromAxisAngle(UP, yaw)
		}

		if (this.id === game.controlledCharacter) this.cameraProxy?.lookInWorldDirection(direction)

		return this
	}

	get position(): Vector3 {
		const pos = this.runtime.rigidBody.current?.translation()

		if (pos) return this._position.copy(pos)

		this.runtime.object3D.current?.getWorldPosition(this._position)
		return this._position
	}

	get orientation(): Quaternion {
		const rot =
			this.runtime.rigidBody.current?.rotation() ?? this.runtime.object3D?.current?.quaternion

		if (rot) return this._orientation.copy(rot)
		return this._orientation
	}

	get velocity(): Vector3 | undefined {
		return this.physic?.velocity
	}

	distanceTo(target: Vector3) {
		return this.position.distanceTo(target)
	}

	isInRange(target: Vector3, maxDistance = INTERACTION_MAX_DISTANCE) {
		return this.distanceTo(target) <= maxDistance
	}
}
