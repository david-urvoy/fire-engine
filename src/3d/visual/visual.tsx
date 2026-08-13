import { useLayoutEffect, type PropsWithChildren } from 'react'

import { game, useEntity, useGame } from '../../game'
import type { GroupProps } from '../../lib'
import { LAYERS } from '../../lib/enums/layers'

export function Visual({
	interactable = false,
	children,
	onClick,
	...props
}: PropsWithChildren<
	GroupProps & {
		interactable?: boolean
	}
>) {
	const { entityManager } = useGame()
	const { id, entity } = useEntity()

	useLayoutEffect(() => {
		entity.runtime.object3D?.current?.traverse((child) => {
			child.userData.entityId = entity.id
		})

		return () => (entity.runtime.object3D = undefined)
	}, [entity])

	return (
		<group
			ref={entity.runtime.object3D}
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
