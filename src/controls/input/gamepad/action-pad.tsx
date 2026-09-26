import { game } from '../../..'

export function ActionPad() {
	return (
		<div
			className="pointer-events-auto z-50 h-20 w-20 rounded-full bg-red-600"
			onClick={(e) => {
				game.toggleFullscreen()
				e.stopPropagation()
			}}
			onKeyUp={() => {}}
		/>
	)
}
