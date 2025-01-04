import HoloHud from '../../interface/hud/holo-hud'
import { game, isDev } from '../../store/game-store'

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
