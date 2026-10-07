import { CuboidCollider } from '@react-three/rapier'
import type { PropsWithChildren } from 'react'

import { useSceneLayout } from '../..'

type AdjustableProps = {
	name?: string
	folder: string
	position?: [number, number, number]
	debug?: boolean
}

function Cuboid({
	name,
	folder,
	args: dimensionInput,
	position: positionInput,
	debug = false,
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
		debug,
	})
	return <CuboidCollider name={name} args={dimension} position={position} {...props} />
}

function Group({
	name,
	folder,
	position: positionInput,
	debug = false,
	children,
}: PropsWithChildren<AdjustableProps>) {
	const { position } = useSceneLayout({ name, folder, debug, position: positionInput })

	return <group position={position}>{children}</group>
}

export const Adjustable = {
	Collider: { Cuboid },
	Group,
}
