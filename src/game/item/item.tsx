import { Visual } from '../../3d/visual/visual'
import { eventBus } from '../../lib'
import { Physic } from '../../physics/physic'
import { Entity, type EntityProps } from '../entity/entity'
import { Items } from './items.hooks'

interface ItemProps extends EntityProps {
	name: string
	image?: string
}

export function KinematicItem({ id, name, image, position, children, ...props }: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} position={position} {...props}>
			<Visual onClick={() => eventBus.emit('item_collected', { id, name, image })} interactable>
				{children}
			</Visual>
		</Entity>
	)
}

export function DynamicItem({ id, name, image, position, children, ...props }: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} position={position} {...props}>
			<Physic colliders="cuboid" type="dynamic" position={position}>
				<Visual onClick={() => eventBus.emit('item_collected', { id, name, image })} interactable>
					{children}
				</Visual>
			</Physic>
		</Entity>
	)
}

export function FixedItem({ id, name, image, position, children, ...props }: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} position={position} {...props}>
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
