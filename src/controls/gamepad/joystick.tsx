import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { gamepad } from './gamepad'

const PAD_WIDTH = 40

export function Joystick() {
	const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

	const drag = useDrag(({ down, movement: [mx, my] }) => {
		const pointerDistance = Math.sqrt(mx ** 2 + my ** 2)
		const { x, y } = !down
			? { x: 0, y: 0 }
			: pointerDistance < PAD_WIDTH
				? { x: mx, y: my }
				: { x: (mx * PAD_WIDTH) / pointerDistance, y: (my * PAD_WIDTH) / pointerDistance }
		api.start({ x, y, immediate: down })

		gamepad.direction.set(-x, -y).divideScalar(PAD_WIDTH)
	}, {})

	return (
		<div className="pointer-events-auto relative bottom-1/4 h-32 w-32">
			<svg className="h-full w-full rounded-full bg-green-700" viewBox="-5 -5 310 310">
				<title>Joystick</title>
				<path
					d="M150,0 A150,150 0 1,1 150,300 A150,150 0 1,1 150,0"
					fill="none"
					stroke="rgba(255, 255, 255, 0.4)"
					strokeWidth="5"
					strokeDasharray="205 30"
					strokeDashoffset="221"
				/>
			</svg>
			<animated.div
				{...drag()}
				className="absolute top-1/4 left-1/4 h-1/2 w-1/2 touch-none rounded-full bg-white"
				style={{ x, y }}
			/>
		</div>
	)
}
