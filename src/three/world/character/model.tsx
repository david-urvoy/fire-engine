import { useFrame } from '@react-three/fiber'
import { type PropsWithChildren, type RefObject } from 'react'
import type { Object3D } from 'three'
import { game, timer, useEntity } from '../../../game'

export function Model({
	smoothing = 20,
	children,
	ref,
	...props
}: PropsWithChildren<{
	smoothing?: number
	ref: RefObject<Object3D | null>
}>) {
	const { id } = useEntity()
	const entity = game.entities[id]

	useFrame(() => {
		if (!ref.current || !entity) return

		const alpha = 1 - Math.exp(-timer.getDelta() * smoothing)

		entity.visual.position.lerp(entity.physic.position, alpha)
		entity.visual.orientation.slerp(entity.physic.orientation, alpha)

		ref.current.position.copy(entity.physic.position)
		ref.current.quaternion.copy(entity.physic.orientation)
	})

	return (
		<group ref={ref} {...props}>
			{children}
		</group>
	)
}
