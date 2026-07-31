import { type PropsWithChildren } from 'react'

import { entityManager, game, MOVEMENT_SMOOTHING, useEntity } from '../../game'
import type { GroupProps } from '../../lib'
import { LAYERS } from '../../lib/enums/layers'
import { useRegisterVisual } from './use-visual'

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
	const { id } = useEntity()
	const objectRef = useRegisterVisual()

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
