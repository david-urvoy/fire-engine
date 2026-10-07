import { Helper } from '@react-three/drei'
import { CuboidCollider } from '@react-three/rapier'
import { type PropsWithChildren } from 'react'
import { Color, PointLightHelper } from 'three'
import { useSnapshot } from 'valtio'

import { PointLight, useLight, useSceneLayout, type PointLightProps } from '../..'
import { game } from '../../../game'

type AdjustableProps = {
	name?: string
	folder: string
	position?: [number, number, number]
	hide?: boolean
}

function Cuboid({
	name,
	folder,
	args: dimensionInput,
	position: positionInput,
	hide = false,
	...props
}: AdjustableProps & {
	position?: [number, number, number]
	dimension?: [number, number, number]
} & Parameters<typeof CuboidCollider>[0]) {
	const { dimension, position } = useSceneLayout({
		name,
		folder,
		position: positionInput,
		dimension: dimensionInput,
		hide,
	})
	return <CuboidCollider name={name} args={dimension} position={position} {...props} />
}

function Group({
	name,
	folder,
	position: positionInput,
	hide = false,
	children,
}: PropsWithChildren<AdjustableProps>) {
	const { position } = useSceneLayout({ name, folder, hide, position: positionInput })

	return <group position={position}>{children}</group>
}

function AjustablePointLight({
	name = 'Point Light',
	position,
	intensity: intensityInput = 1,
	color: initialColor = new Color('white'),
}: PointLightProps) {
	const { debug } = useSnapshot(game)
	const { intensity, color, helper } = useLight(
		name,
		{ intensity: intensityInput, color: initialColor },
		{ min: 0, max: 1000, step: 10 },
	)

	return (
		<PointLight position={position} intensity={intensity} color={color}>
			{/* {lightRef.current && <cameraHelper args={[lightRef.current?.shadow.camera]} />} */}
			{debug.enabled && helper && <Helper type={PointLightHelper} />}
		</PointLight>
	)
}

export const Adjustable = {
	Collider: { Cuboid },
	Group,
	Light: { PointLight: AjustablePointLight },
}
