import { proxy, subscribe } from 'valtio'

import { pointerLock } from '../camera/lock/pointer-lock.store'

subscribe(pointerLock, () => {
	if (tweaksStore.keepOpen) tweaksStore.expanded = true
	else {
		tweaksStore.expanded = !pointerLock.isLocked
	}
})

export const tweaksStore = proxy({
	expanded: false,
	keepOpen: false,
})
