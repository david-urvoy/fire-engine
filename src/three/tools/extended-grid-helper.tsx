import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { game } from '../../game'

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
	return (
		<group ref={groupRef} visible={game.isDebug}>
			{Array.from({ length: count }, (_, i) =>
				Array.from({ length: count }, (_, j) => {
					const key = `grid ${i} ${j}`
					return (
						<gridHelper
							key={key}
							args={[10, 10, 'red', 'green']}
							position={[10 * (i - count * 0.5), 0, 10 * (j - count * 0.5)]}
						/>
					)
				}),
			)}
		</group>
	)
}
