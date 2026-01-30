import { useFrame } from '@react-three/fiber'
import { useEffect, type PropsWithChildren } from 'react'
import { game, GameLoopSystem, MOVEMENT_SMOOTHING, useEntity } from '../../../game'

export function Model({
	smoothing = MOVEMENT_SMOOTHING,
	children,
	...props
}: PropsWithChildren<{
	smoothing?: number
}>) {
	const { id, ref } = useEntity()
	const entity = game.entities[id]

	useEffect(() => {
		if (entity) GameLoopSystem.systems.visual.register(entity)
	}, [entity, smoothing])

	useFrame(() => {
		if (!ref.current || !entity) return

		ref.current.position.copy(entity.visual.position)
		ref.current.quaternion.copy(entity.visual.orientation)
	})

	return (
		<group ref={ref} {...props}>
			{children}
		</group>
	)
}
