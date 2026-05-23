import { useEffect, type PropsWithChildren } from 'react'

import { useEntity } from '../..'
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
	children
}: PropsWithChildren<{ disabled?: boolean; onClick?: () => void }>) {
	useDisplayName(disabled)

	return <group onClick={onClick}>{children}</group>
}
