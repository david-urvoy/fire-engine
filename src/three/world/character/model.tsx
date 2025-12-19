import { useFrame } from '@react-three/fiber'
import { useRef, type PropsWithChildren } from 'react'
import type { Object3D } from 'three'
import type { EntityState } from '../../../game'

export function Model({
	source,
	smoothing = 20,
	children,
	...props
}: {
	source: EntityState
	smoothing?: number
} & PropsWithChildren) {
	const target = useRef<Object3D | null>(null)

	useFrame((_, delta) => {
		if (!target.current || !source.physic) return

		const alpha = 1 - Math.exp(-delta * smoothing)

		source.visual.position.copy(source.physic.position)
		source.visual.orientation.copy(source.physic.orientation)

		target.current.position.lerp(source.physic.position, alpha)
		target.current.quaternion.slerp(source.physic.orientation, alpha)
	})

	return (
		<group ref={target} {...props}>
			{children}
		</group>
	)
}
