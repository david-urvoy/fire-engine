import { type RefObject, useCallback, useEffect, useRef } from 'react'
import { Euler } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export function PointerLock({ controls }: { controls: RefObject<OrbitControlsImpl | null> }) {
	const sensitivity = 0.002
	const rotation = useRef(new Euler())

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!document.pointerLockElement) return
			rotation.current.y -= event.movementX * sensitivity
			rotation.current.x -= event.movementY * sensitivity
			rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI, rotation.current.x)) // Clamp pitch

			controls.current?.setPolarAngle(rotation.current.x)
			controls.current?.setAzimuthalAngle(rotation.current.y)
		},
		[controls],
	)

	const handleClick = useCallback((event: MouseEvent) => {
		if ((event.target as HTMLElement).tagName === 'CANVAS') document.body.requestPointerLock()
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		document.addEventListener('click', handleClick, { signal: controller.signal })
		document.addEventListener('mousemove', handleMouseMove, { signal: controller.signal })

		return () => controller.abort()
	}, [handleClick, handleMouseMove])

	return <></>
}
