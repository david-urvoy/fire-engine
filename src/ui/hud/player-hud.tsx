import { game } from '../../game'
import { isDev } from '../../settings'
import { HoloHud } from './holo-hud'

export const PlayerHud = () => (
	<HoloHud
		options={{
			save: { action: () => console.log('save') },
			load: { action: () => console.log('load') },
			...(isDev && {
				debug: {
					action: () => {
						game.isDebug = !game.isDebug
					},
				},
			}),
		}}
	/>
)
