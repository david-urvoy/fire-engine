import { proxy } from 'valtio'

type CameraType = 'first-person' | 'orbit'

export const cameraStore = proxy<{ type: CameraType }>({ type: 'first-person' })
