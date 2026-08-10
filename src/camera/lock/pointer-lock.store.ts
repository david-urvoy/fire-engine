import { createRef } from 'react'
import type { PointerLockControls } from 'three-stdlib'
import { proxy, ref } from 'valtio'

export const pointerLock = proxy({
	ref: ref(createRef<PointerLockControls | null>()),
	isLocked: false,
})
