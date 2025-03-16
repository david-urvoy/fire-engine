import { proxy, useSnapshot } from 'valtio'
import { FirstPersonView } from './subjective-view/first-person-view'
import { ThirdPersonView } from './subjective-view/third-person-view'

type ControlsType = 'first-person' | 'third-person'
export const ControlsType: { type: ControlsType } = proxy({ type: 'first-person' })

const controlsMap = {
	'first-person': <FirstPersonView />,
	'third-person': <ThirdPersonView />,
}

export function CameraView() {
	const { type } = useSnapshot(ControlsType)
	return controlsMap[type]
}
