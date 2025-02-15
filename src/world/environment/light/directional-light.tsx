// @ts-nocheck

import { animated } from '@react-spring/three'
import { Helper } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { type DirectionalLight, DirectionalLightHelper, type Group } from 'three'
import { useSnapshot } from 'valtio'
import { time } from '../../../store/time-store'
import { useLight } from './use-light'

export function StarLight() {
	const starlight = useRef<DirectionalLight>(null)
	const target = useRef<Group>(null)
	const { isDay } = useSnapshot(time)
	const springs = useLight({
		folderName: `${isDay ? 'Sun' : 'Moon'} Light`,
		lightProvider: (period) => period.light.directional,
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
				position={[time.isDay ? (12 * 60 - (time.hours * 60 + time.minutes)) / 20 : 5, 50, 5]}
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
