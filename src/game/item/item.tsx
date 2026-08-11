import { Visual } from '../../3d/visual/visual'
import { eventBus } from '../../lib'
import { Physic } from '../../physics/physic'
import { Entity, type EntityProps } from '../entity/entity'
import { useIsCollected } from './items.manager'

export function KinematicItem({ id, position, children, ...props }: EntityProps) {
	const isCollected = useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} position={position} {...props}>
			<Visual onClick={() => eventBus.emit('item_collected', { itemId: id })} interactable>
				{children}
			</Visual>
		</Entity>
	)
}

export function DynamicItem({ id, position, children, ...props }: EntityProps) {
	const isCollected = useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} position={position} {...props}>
			<Physic colliders="cuboid" type="dynamic" position={position}>
				<Visual onClick={() => eventBus.emit('item_collected', { itemId: id })} interactable>
					{children}
				</Visual>
			</Physic>
		</Entity>
	)
}

export function FixedItem({ id, position, children, ...props }: EntityProps) {
	const isCollected = useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id} position={position} {...props}>
			<Physic colliders="cuboid" type="fixed" position={position}>
				<Visual onClick={() => eventBus.emit('item_collected', { itemId: id })} interactable>
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
