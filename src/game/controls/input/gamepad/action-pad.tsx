import { toggleFullscreen } from '../../bindings/fullscreen'

export function ActionPad() {
	return (
		<div
			className="pointer-events-auto z-50 h-20 w-20 rounded-full bg-red-600"
			onClick={(e) => {
				toggleFullscreen()
				e.stopPropagation()
			}}
			onKeyUp={() => { }}
		/>
	)
}
