import { OrbitControls } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import { useSubscribeKey } from '../keyboard/keymap'
import { FirstPersonView } from './subjective-view/first-person-view'
import { ThirdPersonView } from './subjective-view/third-person-view'

type ControlsType = 'first-person' | 'third-person' | 'orbit'
export const ControlsType: { type: ControlsType } = proxy({ type: 'first-person' })

const controlsMap = {
	'first-person': <FirstPersonView />,
	'third-person': <ThirdPersonView />,
	orbit: <OrbitControls />,
}

export function CameraView() {
	const { type } = useSnapshot(ControlsType)
	useSubscribeKey('KeyP', () => {
		if (ControlsType.type === 'first-person') ControlsType.type = 'orbit'
		else ControlsType.type = 'first-person'
	})

	return controlsMap[type]
}
