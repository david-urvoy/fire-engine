import { useToggleFullscreen } from '../../bindings/fullscreen'

export function ActionPad() {
	const toggleFullscreen = useToggleFullscreen()

	return (
		<div
			className="pointer-events-auto z-50 h-20 w-20 rounded-full bg-red-600"
			onClick={(e) => {
				toggleFullscreen()
				e.stopPropagation()
			}}
			onKeyUp={() => {}}
		/>
	)
}
