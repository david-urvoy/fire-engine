import { type Action, game } from '../../../game'
import { ControlsType } from '../../../three'

export const KeyboardActions: Partial<Record<Action, () => void>> = {
	mobile: () => {
		game.isMobile = !game.isMobile
	},
	toggleDebug: () => {
		game.isDebug = !game.isDebug
	},
	switchCameraType: () => {
		ControlsType.type = ControlsType.type === 'first-person' ? 'orbit' : 'first-person'
	},
}
