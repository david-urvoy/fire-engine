import { useFrame } from '@react-three/fiber'
import { useEffect, type PropsWithChildren } from 'react'
import { GameLoopSystem, MOVEMENT_SMOOTHING, useEntity } from '../../../game'

export function Model({
	smoothing = MOVEMENT_SMOOTHING,
	children,
	...props
}: PropsWithChildren<{
	smoothing?: number
}>) {
	const { ref, entity } = useEntity()

	useEffect(() => {
		GameLoopSystem.systems.visual.register(entity)
		return () => entity && GameLoopSystem.systems.visual.unregister(entity)
	}, [entity, smoothing])

	useFrame(() => {
		if (!ref.current) return

		ref.current.position.copy(entity.visual.position)
		ref.current.quaternion.copy(entity.visual.orientation)
	})

	return (
		<group ref={ref} {...props}>
			{children}
		</group>
	)
}
