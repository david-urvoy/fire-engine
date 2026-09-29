import type { ThreeElements } from '@react-three/fiber'

import { Visual } from '../../3d/visual/visual'
import { eventBus } from '../../lib'
import { KinematicMotor } from '../../physics'
import { Physic } from '../../physics/physic'
import { Entity, type EntityProps } from '../entity/entity'
import { Items } from './items.hooks'

export type ItemProps = EntityProps &
	Omit<ThreeElements['mesh'], 'id'> & {
		name?: string
		image?: string
	}

export function KinematicItem({ id, name = id, image, position, children, ...props }: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} {...props}>
			<KinematicMotor position={position}>
				<Visual onClick={() => eventBus.emit('item_collected', { id, name, image })} interactable>
					{children}
				</Visual>
			</KinematicMotor>
		</Entity>
	)
}

export function DynamicItem({
	id,
	name = id,
	image,
	position,
	rotation,
	children,
	...props
}: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} {...props}>
			<Physic colliders="cuboid" type="dynamic" position={position} rotation={rotation}>
				<Visual onClick={() => eventBus.emit('item_collected', { id, name, image })} interactable>
					{children}
				</Visual>
			</Physic>
		</Entity>
	)
}

export function FixedItem({ id, name = id, image, position, children, ...props }: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} {...props}>
			<Physic colliders="cuboid" type="fixed" position={position}>
				<Visual onClick={() => eventBus.emit('item_collected', { id, name, image })} interactable>
					{children}
				</Visual>
			</Physic>
		</Entity>
	)
}

export const Item = {
	Kinematic: KinematicItem,
	Dynamic: DynamicItem,
	Fixed: FixedItem,
}
