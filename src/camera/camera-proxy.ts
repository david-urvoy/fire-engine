import { Euler, Quaternion, Vector3 } from 'three'

import { game } from '../game'

export const CameraProxy = {
	_cameraDirection: new Vector3(),
	_euler: new Euler(),

	get orientation() {
		return game.pointerLock.ref.current?.getObject().quaternion.clone() ?? new Quaternion()
	},
	set orientation(quat: Quaternion) {
		game.pointerLock.ref.current?.getObject().quaternion.copy(quat)
	},

	lookAt(target: Vector3) {
		game.pointerLock.ref.current?.getObject().lookAt(target)
	},

	lookInDirection(direction: Vector3) {
		const controlsObj = game.pointerLock.ref.current?.getObject()
		if (!controlsObj) return this

		this._cameraDirection.copy(direction)

		const target = new Vector3().addVectors(controlsObj.position, direction)
		controlsObj.lookAt(target)
		return this
	},

	lookInWorldDirection(direction: Vector3) {
		const controlsObj = game.pointerLock.ref.current?.getObject()
		if (!controlsObj) return this

		this._cameraDirection.copy(direction)

		const target = new Vector3().addVectors(controlsObj.position, direction)
		controlsObj.lookAt(target)
		return this
	},

	get yaw(): number {
		const controlsObj = game.pointerLock.ref.current?.getObject()
		if (!controlsObj) return 0
		this._euler.setFromQuaternion(controlsObj.quaternion, 'YXZ')
		return this._euler.y
	},

	get pitch(): number {
		const controlsObj = game.pointerLock.ref.current?.getObject()
		if (!controlsObj) return 0
		this._euler.setFromQuaternion(controlsObj.quaternion, 'YXZ')
		return this._euler.x
	},
}
