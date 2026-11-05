import { useEffect, type PropsWithChildren } from 'react'

import { useNavigation } from './navigation.context'

export type PointOfInterest<Group extends string = string> = {
	id: string
	name: string
	group: Group
	position: [number, number, number]
	radius: number
}

export function PointOfInterest<Group extends string = string>({
	id,
	name,
	group,
	position,
	radius,
	children,
}: PropsWithChildren<PointOfInterest<Group>>) {
	const { addPointOfInterest } = useNavigation()
	useEffect(
		() => addPointOfInterest({ id, name, group, position, radius }),
		[id, name, group, position, radius, addPointOfInterest],
	)

	return <group position={position}>{children}</group>
}
