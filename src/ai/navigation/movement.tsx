import { useEntity } from '@david-urvoy/fire-engine'
import { useCallback, useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { eventBus } from '../../lib'

export function MoveToTarget({ speed }: { speed?: number }) {
	const { entity } = useEntity()
	const { target } = useSnapshot(entity.controls)

	useEffect(() => {
		if (!target || !speed) return
		entity.moveTo(target, speed)
		entity.lookAt(target)
	}, [entity, target, speed])

	return null
}

export function useOnHasReached(onReach?: () => void) {
	const { entity } = useEntity()

	const callback = useCallback(
		({ id }: { id: string }) => {
			if (id !== entity.id) return
			onReach?.()
		},
		[onReach, entity.id],
	)

	useEffect(() => {
		eventBus.on('hasReached', callback)
		return () => eventBus.off('hasReached', callback)
	}, [entity.id, callback])
}
