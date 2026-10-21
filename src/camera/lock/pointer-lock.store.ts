import { createRef } from 'react'
import type { PointerLockControls } from 'three-stdlib'
import { proxy, ref } from 'valtio'

export const pointer = proxy({
	ref: ref(createRef<PointerLockControls | null>()),
	isLocked: false,
	lock() {
		this.ref.current?.lock()
		this.isLocked = true
	},
	unlock() {
		this.ref.current?.unlock()
		this.isLocked = false
	},
})
