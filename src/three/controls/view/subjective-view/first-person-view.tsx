import { PointerLockControls } from '@react-three/drei'
import { VERTICAL } from '../../../../game'
import { ControlledCharacter } from '../../use-player-controls'
import { useSubjectiveView } from './use-subjective-view'

/**
 * First person view
 */
export function FirstPersonView() {
	const { ref: target } = ControlledCharacter

	useSubjectiveView((camera) => {
		if (!target.current) return
		target.current.getWorldPosition(camera.position).add(VERTICAL)
	})

	return <PointerLockControls selector="canvas" />
}
