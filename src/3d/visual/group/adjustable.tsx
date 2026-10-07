import { CuboidCollider } from '@react-three/rapier'
import type { PropsWithChildren } from 'react'

import { useSceneLayout } from '../..'

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

export const Adjustable = {
	Collider: { Cuboid },
	Group,
}
