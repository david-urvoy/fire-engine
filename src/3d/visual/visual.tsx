import { type PropsWithChildren } from 'react'

import { game, MOVEMENT_SMOOTHING, useEntity, useGame } from '../../game'
import type { GroupProps } from '../../lib'
import { LAYERS } from '../../lib/enums/layers'
import { useRegisterVisual } from './use-visual'

export function Visual({
	smoothing: _smoothing = MOVEMENT_SMOOTHING,
	interactable = false,
	children,
	onClick,
	...props
}: PropsWithChildren<
	GroupProps & {
		smoothing?: number
		interactable?: boolean
	}
>) {
	const { entityManager } = useGame()
	const { id, entity } = useEntity()
	const objectRef = useRegisterVisual(entity)

	return (
		<group
			ref={objectRef}
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
