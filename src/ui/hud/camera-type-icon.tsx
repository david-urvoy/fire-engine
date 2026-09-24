import { useSnapshot } from 'valtio'

import firstPersonViewImage from '../../../../assets/images/first_person_view.svg'
import orbitCameraImage from '../../../../assets/images/orbital_camera.svg'
import { game } from '../../game'

export function CameraTypeIcon() {
	const { type } = useSnapshot(game.camera)

	return (
		<img
			src={type === 'orbit' ? orbitCameraImage : firstPersonViewImage}
			height={100}
			width={100}
			className="fixed right-8 bottom-40"
		/>
	)
}
