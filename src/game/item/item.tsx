import type { ThreeElements } from '@react-three/fiber'

import { Visual } from '../../3d/visual/visual'
import { eventBus } from '../../lib'
import { KinematicMotor } from '../../physics'
import { PhysicBody, type PhysicBodyProps } from '../../physics/body'
import { Entity, type EntityProps } from '../entity/entity'
import { Items } from './items.hooks'

export type ItemProps = EntityProps &
	PhysicBodyProps &
	Omit<ThreeElements['mesh'], 'id'> & {
		name?: string
		image?: string
		onClick?: () => void
	}

export function KinematicItem({ id, name = id, image, onClick, children, ...props }: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id}>
			<KinematicMotor {...props}>
				<Visual
					onClick={() => {
						eventBus.emit('item_collected', { id, name, image })
						onClick?.()
					}}
					interactable
				>
					{children}
				</Visual>
			</KinematicMotor>
		</Entity>
	)
}

export function DynamicItem({ id, name = id, image, onClick, children, ...props }: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id}>
			<PhysicBody colliders="cuboid" type="dynamic" {...props}>
				<Visual
					onClick={() => {
						eventBus.emit('item_collected', { id, name, image })
						onClick?.()
					}}
					interactable
				>
					{children}
				</Visual>
			</PhysicBody>
		</Entity>
	)
}

export function FixedItem({ id, name = id, image, onClick, children, ...props }: ItemProps) {
	const isCollected = Items.useIsCollected(id)

	if (isCollected) return null

	return (
		<Entity id={id}>
			<PhysicBody colliders="cuboid" type="fixed" {...props}>
				<Visual
					onClick={() => {
						eventBus.emit('item_collected', { id, name, image })
						onClick?.()
					}}
					interactable
				>
					{children}
				</Visual>
			</PhysicBody>
		</Entity>
	)
}

export const Item = {
	Kinematic: KinematicItem,
	Dynamic: DynamicItem,
	Fixed: FixedItem,
}
