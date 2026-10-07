import { animated } from '@react-spring/three'
import { Helper } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { PointLightHelper, type Color, type PointLight as PointLightType } from 'three'
import { useSnapshot } from 'valtio'

import { game } from '../../../game'
import { useLight } from './use-light'

export function PointLight({
	name,
	position,
	intensity: intensityInput,
	color: initialColor,
}: {
	name: string
	position?: [x: number, y: number, z: number]
	intensity: number
	color: Color
}) {
	const { debug } = useSnapshot(game)
	const { intensity, color, helper } = useLight(
		`Point Light ${name}`,
		{ intensity: intensityInput, color: initialColor },
		{ min: 0, max: 1000, step: 10 },
	)
	const lightRef = useRef<PointLightType>(null)

	useEffect(() => {
		if (!lightRef.current) return

		lightRef.current.shadow.mapSize.set(2048, 2048)
		lightRef.current.shadow.camera.near = 1
		lightRef.current.shadow.camera.far = 3
	}, [])

	return (
		<animated.pointLight
			ref={lightRef}
			position={position}
			intensity={intensity}
			color={color}
			distance={8}
			castShadow
		>
			{/* {lightRef.current && <cameraHelper args={[lightRef.current?.shadow.camera]} />} */}
			{debug.enabled && helper && <Helper type={PointLightHelper} />}
		</animated.pointLight>
	)
}
