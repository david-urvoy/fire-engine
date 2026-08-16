import { useEffect, type PropsWithChildren } from 'react'

import { game, useEntity, useGame } from '../../game'
import type { GroupProps } from '../../lib'
import { LAYERS } from '../../lib/enums/layers'

export interface VisualProps extends GroupProps {
	interactable?: boolean
}

export function Visual({
	interactable = false,
	children,
	onClick,
	...props
}: PropsWithChildren<VisualProps>) {
	const { entityManager } = useGame()
	const { id, entity } = useEntity()

	useEffect(() => {
		const object3D = entity.runtime.object3D
		object3D.current?.traverse((child) => {
			child.userData.entityId = entity.id
		})

		return () => {
			object3D.current = null
		}
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
