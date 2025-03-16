import type { RefObject } from 'react'
import { type Group, Quaternion, Vector3 } from 'three'

export const CameraTarget: {
	velocity: Vector3
	orientation: Quaternion
	ref: RefObject<Group | null>
} = {
	velocity: new Vector3(),
	orientation: new Quaternion(),
	ref: { current: null },
}
