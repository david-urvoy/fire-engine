import { animated } from '@react-spring/three'
import { Helper } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Color, type DirectionalLight, DirectionalLightHelper, type Group } from 'three'
import { useSnapshot } from 'valtio'
import { gameTime } from '../../../../time'
import { useLight } from './use-light'

// export const light = {
// 	position: [gameTime?.isDay ? (12 * 60 - (gameTime.hour * 60 + gameTime.minute)) / 20 : 5, 50, 5],
// }

export function StarLight() {
	const starlight = useRef<DirectionalLight>(null)
	const target = useRef<Group>(null)
	const { isDay, hour, minute } = useSnapshot(gameTime)
	const springs = useLight({
		folderName: `${isDay ? 'Sun' : 'Moon'} Light`,
		light: { color: new Color('#f3f37e'), intensity: 0.8 },
	})

	useEffect(() => {
		if (starlight.current) starlight.current.visible = isDay
	}, [isDay])

	useFrame(() => {
		if (starlight.current && target.current) starlight.current.target = target.current
	})

	return (
		<>
			<group ref={target} />
			<animated.directionalLight
				ref={starlight}
				position={[isDay ? (12 * 60 - (hour * 60 + minute)) / 20 : 5, 50, 5]}
				intensity={springs.intensity}
				color={springs.color}
				castShadow
			>
				<Helper type={DirectionalLightHelper} />
				<orthographicCamera attach="shadow-camera" args={[-25, 25, 25, -25]} />
			</animated.directionalLight>
		</>
	)
}
