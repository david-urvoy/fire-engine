import type { ThreeElements } from '@react-three/fiber'

import { Visual } from '../../3d/visual/visual'
import { eventBus } from '../../lib'
import { KinematicMotor } from '../../physics'
import { Body, type BodyProps } from '../../physics/body'
import { Entity, type EntityProps } from '../entity/entity'
import { Items } from './items.hooks'

export type ItemProps = EntityProps &
	BodyProps &
	Omit<ThreeElements['mesh'], 'id'> & {
		name?: string
		image?: string
	}

export function KinematicItem({
	id,
	name = id,
	image,
	position,
	debug,
	children,
	...props
}: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} {...props}>
			<KinematicMotor position={position} debug={debug}>
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
	debug,
	children,
	...props
}: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} {...props}>
			<Body colliders="cuboid" type="dynamic" position={position} rotation={rotation} debug={debug}>
				<Visual onClick={() => eventBus.emit('item_collected', { id, name, image })} interactable>
					{children}
				</Visual>
			</Body>
		</Entity>
	)
}

export function FixedItem({
	id,
	name = id,
	image,
	position,
	debug,
	children,
	...props
}: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} {...props}>
			<Body colliders="cuboid" type="fixed" position={position} debug={debug}>
				<Visual onClick={() => eventBus.emit('item_collected', { id, name, image })} interactable>
					{children}
				</Visual>
			</Body>
		</Entity>
	)
}

export const Item = {
	Kinematic: KinematicItem,
	Dynamic: DynamicItem,
	Fixed: FixedItem,
}
