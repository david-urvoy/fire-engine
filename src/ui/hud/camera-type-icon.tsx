import { useSnapshot } from 'valtio'

import firstPersonViewImage from '../../../../assets/images/first_person_view.svg'
import orbitCameraImage from '../../../../assets/images/orbital_camera.svg'
import { CameraType } from '../../camera'

export function CameraTypeIcon() {
	const { type } = useSnapshot(CameraType)

	return (
		<img
			src={type === 'orbit' ? orbitCameraImage : firstPersonViewImage}
			height={100}
			width={100}
			className="fixed right-8 bottom-40"
		/>
	)
}
