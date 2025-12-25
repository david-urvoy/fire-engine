import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { game, GRAVITY_CONST, timer, useEntity } from '../../../../game'
import { useCharacterController } from './character-controller'

export function Gravity() {
	const controller = useCharacterController()
	const gravityComponent = useRef(0)
	const grounded = useRef(false)
	const { id } = useEntity()
	const entity = game.entities[id]

	if (!entity) throw new Error(`Entity "${id}" not found`)

	useFrame(() => {
		if (!controller.current) return

		const delta = timer.getDelta()

		entity.controls.velocity.y += gravityComponent.current / 10
		if (controller.current.computedGrounded() !== grounded.current) {
			grounded.current = controller.current.computedGrounded()
		}
		if (grounded.current) gravityComponent.current = 0
		gravityComponent.current -= GRAVITY_CONST * delta
	})

	return null
}
