import { useFrame } from '@react-three/fiber'
import { useEffect, type PropsWithChildren } from 'react'
import { MOVEMENT_SMOOTHING, useEntity, useGameLoopSystem } from '../../game'

export function Visual({
	smoothing = MOVEMENT_SMOOTHING,
	children,
	...props
}: PropsWithChildren<{
	smoothing?: number
}>) {
	const { ref, entity } = useEntity()
	const { visual } = useGameLoopSystem()

	useEffect(() => {
		visual.register(entity)
		return () => entity && visual.unregister(entity)
	}, [visual, entity, smoothing])

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
