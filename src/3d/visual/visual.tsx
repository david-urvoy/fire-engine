import { useEffect, useLayoutEffect, useRef, type PropsWithChildren } from 'react'
import { type Group } from 'three'

import { entityManager, game, MOVEMENT_SMOOTHING, useEntity, useGameLoopSystem } from '../../game'
import type { GroupProps } from '../../lib'
import { LAYERS } from '../../lib/enums/layers'

export function Visual({
	position = [0, 0, 0],
	smoothing: _smoothing = MOVEMENT_SMOOTHING,
	interactable = false,
	children,
	onClick,
	...props
}: PropsWithChildren<
	GroupProps & {
		position?: [number, number, number]
		smoothing?: number
		interactable?: boolean
	}
>) {
	const { id, entity } = useEntity()
	const { visual } = useGameLoopSystem()
	const objectRef = useRef<Group>(null)

	useEffect(() => {
		visual.register(entity)

		return () => {
			entity.visual.runtime.object3D = undefined
			visual.unregister(entity)
		}
	}, [visual, entity])

	useLayoutEffect(() => {
		const object3D = objectRef.current
		if (!object3D) return

		entity.visual.runtime.object3D = object3D

		object3D.traverse((child) => {
			child.userData.entityId = id
		})
	}, [id, entity])

	return (
		<group
			ref={objectRef}
			position={position}
			{...props}
			onClick={(e) => {
				if (interactable && !entityManager.get(game.controlledCharacter)?.isInRange(e.point)) return

				onClick?.(e)
				e.stopPropagation()
			}}
			onUpdate={(mesh) => {
				mesh.traverse((child) => {
					child.userData.entityId = id
					if (interactable && child.type === 'Mesh') {
						child.layers.enable(LAYERS.INTERACTABLE)
					}
				})
			}}
		>
			{children}
		</group>
	)
}
