import { useEffect, type PropsWithChildren } from 'react'
import { type Object3D } from 'three'

import { entityManager, game, useEntity } from '../..'
import { sceneRegistry } from '../../system/scene-registry'

function useDisplayName(disabled = false) {
	const { id, entity } = useEntity()
	useEffect(() => {
		if (!disabled) {
			const object = { entity }
			sceneRegistry.add(id, object)
			return () => sceneRegistry.remove(id, object)
		}
	}, [id, entity, disabled])
}

export function Interactable({
	disabled = false,
	onClick,
	children,
}: PropsWithChildren<{
	disabled?: boolean
	onClick?: (object: Object3D) => void
}>) {
	useDisplayName(disabled)

	return (
		<group
			onClick={(e) => {
				if (!entityManager.get(game.controlledCharacter)?.isInRange(e.point)) return

				onClick?.(e.object)
				e.stopPropagation()
			}}
		>
			{children}
		</group>
	)
}
