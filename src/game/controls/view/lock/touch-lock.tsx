import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export function TouchControls() {
	const { camera } = useThree()
	const sensitivity = 0.02

	const touch = useRef({ x: 0, y: 0 })
	const pitch = useRef(0)
	const yaw = useRef(0)
	const activeTouchId = useRef<number | null>(null)

	// Your joystick root selector
	const isTouchOnJoystick = useMemo(
		() =>
			(target: EventTarget | null): boolean => {
				if (!(target instanceof HTMLElement)) return false
				return !!target.closest('.virtual-joystick')
			},
		[],
	)

	useEffect(() => {
		// Initialize pitch/yaw from camera
		const euler = new THREE.Euler().copy(camera.rotation)
		pitch.current = euler.x
		yaw.current = euler.y

		const onTouchStart = (e: TouchEvent) => {
			// Skip if touching joystick or already tracking a touch
			if (activeTouchId.current !== null) return

			const t = e.changedTouches[0]
			if (!t || isTouchOnJoystick(e.target)) return

			activeTouchId.current = t.identifier
			touch.current.x = t.clientX
			touch.current.y = t.clientY
		}

		const onTouchMove = (e: TouchEvent) => {
			if (activeTouchId.current === null) return

			const t = Array.from(e.changedTouches).find((t) => t.identifier === activeTouchId.current)
			if (!t) return

			const dx = t.clientX - touch.current.x
			const dy = t.clientY - touch.current.y

			yaw.current -= dx * sensitivity
			pitch.current -= dy * sensitivity
			pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current))

			const newRotation = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
			camera.quaternion.setFromEuler(newRotation)

			touch.current.x = t.clientX
			touch.current.y = t.clientY
		}

		const onTouchEnd = (e: TouchEvent) => {
			const ended = Array.from(e.changedTouches).some((t) => t.identifier === activeTouchId.current)
			if (ended) activeTouchId.current = null
		}

		window.addEventListener('touchstart', onTouchStart)
		window.addEventListener('touchmove', onTouchMove)
		window.addEventListener('touchend', onTouchEnd)
		window.addEventListener('touchcancel', onTouchEnd)

		return () => {
			window.removeEventListener('touchstart', onTouchStart)
			window.removeEventListener('touchmove', onTouchMove)
			window.removeEventListener('touchend', onTouchEnd)
			window.removeEventListener('touchcancel', onTouchEnd)
		}
	}, [camera, isTouchOnJoystick])

	return null
}
