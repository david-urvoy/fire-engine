import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useControlledCharacter } from '../../game'

const tmpDir = new Vector3()

export function CameraTracking() {
	const controlledCharacter = useControlledCharacter()

	useFrame(({ camera }) => {
		if (!controlledCharacter) return

		camera.position.copy(controlledCharacter.visual.position)
		camera.position.y += 0.4
		camera.getWorldDirection(tmpDir)
		tmpDir.y = 0

		controlledCharacter.lookAtDirection(tmpDir)
	})

	return <></>
}
