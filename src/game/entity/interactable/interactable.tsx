import { useEffect, type PropsWithChildren } from 'react'
import type { Object3D } from 'three'

import { useEntity } from '../..'
import { usePlayer } from '../../character/player.hook'
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
}: PropsWithChildren<{ disabled?: boolean; onClick?: (object: Object3D) => void }>) {
	useDisplayName(disabled)
	const player = usePlayer()

	return (
		<group
			onClick={(e) => {
				if (!player?.isInRange(e.object)) return

				onClick?.(e.object)
				e.stopPropagation()
			}}
		>
			{children}
		</group>
	)
}
