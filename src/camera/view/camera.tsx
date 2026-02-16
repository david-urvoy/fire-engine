import { OrbitControls } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import { useReticleInteraction } from '../../ui'
import { FirstPersonView } from './first-person-view'

type CameraType = 'first-person' | 'orbit'
export const CameraType: { type: CameraType } = proxy({ type: 'first-person' })

const cameraTypesMap = {
	'first-person': <FirstPersonView />,
	orbit: <OrbitControls />,
}

export function Camera() {
	const { type } = useSnapshot(CameraType)

	useReticleInteraction()

	return cameraTypesMap[type]
}
