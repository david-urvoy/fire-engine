import type { Color } from 'three'

export function PointLight(props: {
	position: [x: number, y: number, z: number]
	intensity: number
	color: Color
	index: number
}) {
	// const { position, intensity, color } = useControls('Debug', {
	// 	Lights: folder({
	// 		[`Point Light ${props.index}`]: folder({
	// 			position: { value: props.position },
	// 			intensity: { value: props.intensity, step: 1, min: 0, max: 100 },
	// 			color: `#${props.color.getHexString()}`,
	// 		}),
	// 	}),
	// })

	return <pointLight position={props.position} intensity={props.intensity} color={props.color} />
}
