import { OrbitControls } from '@react-three/drei'
import { useSnapshot } from 'valtio'

import { game } from '../../game'
import { useReticleInteraction } from '../../ui'
import { FirstPersonView } from './first-person-view'

export function Camera() {
	const { type } = useSnapshot(game.camera)

	useReticleInteraction()

	return type === 'first-person' ? <FirstPersonView /> : <OrbitControls />
}
