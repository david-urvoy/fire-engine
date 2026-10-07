import { animated, type Overwrite } from '@react-spring/three'
import type { InstanceProps, MathProps, ReactProps } from '@react-three/fiber'
import { useEffect, useRef, type PropsWithChildren } from 'react'
import { Color, type PointLight as PointLightType } from 'three'

export type PointLightProps = {
	position?: [number, number, number]
	color?: Color
	intensity?: number
	name?: string
} & Omit<InstanceProps<PointLightType, typeof PointLightType>, 'object'> &
	Partial<Overwrite<PointLightType, MathProps<PointLightType> & ReactProps<PointLightType>>>

export function PointLight({
	position,
	intensity = 1,
	color = new Color('white'),
	distance = 8,
	children,
	...props
}: PropsWithChildren<PointLightProps>) {
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
			distance={distance}
			castShadow
			{...props}
		>
			{children}
		</animated.pointLight>
	)
}
