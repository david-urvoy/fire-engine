import { OrbitControls } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import { useReticleInteraction } from '../../../ui'
import { FirstPersonView } from './first-person-view'
import { ThirdPersonView } from './third-person-view'

type ControlsType = 'first-person' | 'third-person' | 'orbit'
export const ControlsType: { type: ControlsType } = proxy({ type: 'first-person' })

const controlsMap = {
	'first-person': <FirstPersonView />,
	'third-person': <ThirdPersonView />,
	orbit: <OrbitControls />,
}

export function CameraControls() {
	const { type } = useSnapshot(ControlsType)

	useReticleInteraction()

	return controlsMap[type]
}
