import { Float, Html } from '@react-three/drei'
import type { HtmlProps } from '@react-three/drei/web/Html'
import { proxy, useSnapshot } from 'valtio'

import { HudOption } from './hud-option'

type ActionOptions = Record<string, { action: () => void }>

const hudSize = 200

const hud = proxy({
	isVisible: false,
	toggle() {
		hud.isVisible = !hud.isVisible
	},
	setVisible(visible: boolean) {
		hud.isVisible = visible
	},
	hide() {
		hud.setVisible(false)
	},
})

export function HoloHud({ options, ...props }: HtmlProps & { options: ActionOptions }) {
	const { isVisible } = useSnapshot(hud)

	// const rotation = new Euler().setFromQuaternion(
	// 	new Quaternion(player.quaternion.x, player.quaternion.y, player.quaternion.z, player.quaternion.w),
	// )
	// if (rotation) {
	// 	rotation.x = -Math.PI / 2
	// 	rotation.y = 0
	// 	rotation.z = Math.PI / 4
	// }

	if (!isVisible) return <></>
	return (
		<Float rotationIntensity={1} floatIntensity={1.5} speed={6}>
			<Html
				wrapperClass="holo-hud"
				distanceFactor={10} // If set (default: undefined), children will be scaled by this factor, and also by distance to a PerspectiveCamera / zoom by a OrthographicCamera.
				zIndexRange={[100, 0]} // Z-order range (default=[16777271, 0])
				transform // If true, applies matrix3d transformations (default=false)
				sprite // Renders as sprite, but only in transform mode (default=false)
				// position={[0, 3, 0]}
				// prepend // Project content behind the canvas (default: false)
				// center // Adds a -50%/-50% css transform (default: false) [ignored in transform mode]
				// fullscreen // Aligns to the upper-left corner, fills the screen (default:false) [ignored in transform mode]
				// occlude='blending'
				// rotation={rotation ?? undefined}
				onPointerMissed={hud.hide}
				{...props}
			>
				<WheelHud options={options} />
			</Html>
		</Float>
	)
}

export function WheelHud(props: { options: ActionOptions }) {
	const options = Object.entries(props.options)
	return (
		<svg width={hudSize * 2} height={hudSize * 2}>
			<title>hud</title>
			{options?.map(([name, { action }], i) => (
				<HudOption key={name} index={i} total={options.length} hudSize={hudSize} action={action}>
					{name}
				</HudOption>
			))}
		</svg>
	)
}
