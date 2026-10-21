import { proxy, subscribe } from 'valtio'

import { pointer } from '../../camera/lock/pointer-lock.store'

subscribe(pointer, () => {
	if (tweaksStore.keepOpen) tweaksStore.expanded = true
	else {
		tweaksStore.expanded = !pointer.isLocked
	}
})

export const tweaksStore = proxy({
	expanded: false,
	keepOpen: false,
})
