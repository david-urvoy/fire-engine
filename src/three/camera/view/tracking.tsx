import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { FORWARD, useControlledCharacter } from '../../../game'

export function CameraTracking() {
	const controlledCharacter = useControlledCharacter()

	useFrame(({ camera }) => {
		if (!controlledCharacter) return

		camera.position.copy(controlledCharacter.visual.position)

		controlledCharacter.controls.orientation.setFromUnitVectors(
			FORWARD,
			camera.getWorldDirection(new Vector3()).setY(0).negate().normalize(),
		)
	})

	return <></>
}
