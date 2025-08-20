import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { game } from '../../game'
import { useTweaks } from '../../ui'

function roundToNearestTens(num: number) {
	return Math.round(num / 10) * 10
}


export function ExtendedGridHelper({ count = 5 }: { count?: number }) {
	const groupRef = useRef<Group>(null)
	useFrame(({ camera }) => {
		const { x, z } = camera.position
		const roundedX = roundToNearestTens(x)
		const roundedZ = roundToNearestTens(z)
		groupRef.current?.position.set(roundedX, 0, roundedZ)
	})
	const gridSize = useTweaks({ title: 'Debug' })
		.addFolder({ title: '𖣯 Grid' })
		.addBinding<number>({ params: [{ gridSize: 12 }, 'gridSize', { min: 2, max: 20, step: 2 }] })
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
