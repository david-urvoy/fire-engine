import type { Object3D } from 'three'
import { proxySet } from 'valtio/utils'
import { proxy } from 'valtio/vanilla'

export const interactable = proxy({
	active: proxySet<string>([]),
	groups: proxySet<string>([]),
	_map: new Map<string, Object3D>(),
})
