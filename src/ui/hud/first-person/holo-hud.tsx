import { Html } from '@react-three/drei'
import { useRef } from 'react'
import type { Group } from 'three'

import { InventoryMenu } from '../../game-menu/inventory-menu'

export function HoloHud({ isVisible = true }: { isVisible?: boolean }) {
	const groupRef = useRef<Group>(null)

	if (!isVisible) return null

	return (
		<group ref={groupRef} position={[-0.1, 1.5, -1]}>
			<Html transform className="rounded-xs bg-blue-600 p-px text-[2px]">
				<InventoryMenu />
			</Html>
		</group>
	)
}
