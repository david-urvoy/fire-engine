import { useFrame } from '@react-three/fiber'
import { useCallback, useRef, useState } from 'react'
import type { Group } from 'three'
import { game } from '../../game'
import { useImperativeTweaks } from '../../ui/tweaks/imperative'

function roundToNearestTens(num: number) {
	return Math.round(num / 10) * 10
}


export function ExtendedGridHelper({ count = 5 }: { count?: number }) {
	const [gridSize, setGridSize] = useState(12)
	const groupRef = useRef<Group>(null)
	useFrame(({ camera }) => {
		const { x, z } = camera.position
		const roundedX = roundToNearestTens(x)
		const roundedZ = roundToNearestTens(z)
		groupRef.current?.position.set(roundedX, 0, roundedZ)
	})
	useImperativeTweaks({
		title: '𖣯 Grid', bindings: useCallback((folder) => [
			folder.addBinding({ gridSize }, 'gridSize', { min: 2, max: 20, step: 2 })
				.on('change', ({ value }) => setGridSize(value)),
		], [])
	})
	return (
		<group ref={groupRef} visible={game.isDebug}>
			{Array.from({ length: count }, (_, i) =>
				Array.from({ length: count }, (_, j) => {
					const key = `g-${i}-${j}`
					return (
						<gridHelper
							key={key}
							args={[gridSize, gridSize, 'red', 'green']}
							position={[gridSize * (i - count * 0.5), 0, gridSize * (j - count * 0.5)]}
						/>
					)
				}),
			)}
		</group>
	)
}
