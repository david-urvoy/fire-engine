import { CuboidCollider } from '@react-three/rapier'
import type { PropsWithChildren } from 'react'

import { useSceneLayout } from '..'

function Cuboid({
	name,
	folder,
	args: dimensionInput,
	position: positionInput,
	debug = false,
	...props
}: {
	name?: string
	folder: string
	position?: [number, number, number]
	dimension?: [number, number, number]
	debug?: boolean
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
	debug = false,
	children,
}: PropsWithChildren<{ name: string; folder: string; debug?: boolean }>) {
	const { position } = useSceneLayout({ name, folder, debug })

	return <group position={position}>{children}</group>
}

export const Adjustable = {
	Collider: { Cuboid },
	Group,
}
