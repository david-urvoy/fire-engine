import { proxy } from 'valtio'

type CameraType = 'first-person' | 'orbit'

export const cameraStore = proxy({
	type: 'first-person' as CameraType,
	position: { x: 0, y: 0, z: 0 },
})
