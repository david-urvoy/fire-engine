import { useFrame } from '@react-three/fiber'
import { type PropsWithChildren, type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Euler } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export function PointerLock({
	controls,
	children,
}: PropsWithChildren<{ controls: RefObject<OrbitControlsImpl | null> }>) {
	const sensitivity = 0.002
	const rotation = useRef(new Euler())

	const [isLocked, setIsLocked] = useState(false)

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!isLocked) return
			rotation.current.y -= event.movementX * sensitivity
			rotation.current.x -= event.movementY * sensitivity
			rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI, rotation.current.x)) // Clamp pitch
		},
		[isLocked],
	)

	useEffect(() => {
		const handleClick = () => document.body.requestPointerLock()
		const handlePointerLockChange = () => setIsLocked(!!document.pointerLockElement)

		const controller = new AbortController()
		document.addEventListener('click', handleClick, { signal: controller.signal })
		document.addEventListener('pointerlockchange', handlePointerLockChange, { signal: controller.signal })
		document.addEventListener('mousemove', handleMouseMove, { signal: controller.signal })

		return () => controller.abort()
	}, [handleMouseMove])

	useFrame(() => {
		if (!isLocked || !controls.current) return

		controls.current?.setPolarAngle(rotation.current.x)
		controls.current?.setAzimuthalAngle(rotation.current.y)
	})

	return <>{children}</>
}
