import { OrbitControls } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import { game } from '../../game.store'
import { FirstPersonView } from './first-person-view'
import { ThirdPersonView } from './third-person-view'

type ControlsType = 'first-person' | 'third-person' | 'orbit'
export const ControlsType: { type: ControlsType } = proxy({ type: 'first-person' })

const controlsMap = {
	'first-person': <FirstPersonView />,
	'third-person': <ThirdPersonView />,
	orbit: <OrbitControls />,
}

export function CameraView() {
	const { type } = useSnapshot(ControlsType)
	game.debug = type

	return controlsMap[type]
}
