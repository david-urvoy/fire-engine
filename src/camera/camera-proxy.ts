import { Quaternion, Vector3 } from 'three'
import { game } from '../game'

export class CameraProxy {
	private cameraDirection: Vector3 = new Vector3()
	private pointerLockControls = game.pointerLockControls.current

	get orientation() {
		return this.pointerLockControls?.camera.quaternion.clone() ?? new Quaternion()
	}

	set orientation(quat: Quaternion) {
		this.pointerLockControls?.camera.quaternion.copy(quat)
	}

	lookAt(target: Vector3): void {
		this.pointerLockControls?.camera.lookAt(target)
	}

	lookInDirection(direction: Vector3): void {
		if (!this.pointerLockControls) return

		this.cameraDirection
			.copy(direction)
			.applyQuaternion(this.pointerLockControls?.camera.quaternion)
			.add(this.pointerLockControls?.camera.position)

		this.pointerLockControls?.camera.lookAt(this.cameraDirection)
	}

	lookInWorldDirection(direction: Vector3): void {
		if (!this.pointerLockControls) return

		this.cameraDirection.copy(this.pointerLockControls?.camera.position).add(direction)
		this.pointerLockControls?.camera.lookAt(this.cameraDirection)
	}
}
