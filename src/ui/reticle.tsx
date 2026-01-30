import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Raycaster, Vector2, type Object3D } from 'three'
import { game } from '../game'
import { sceneRegistry } from '../game/entity/scene-registry'

export function Reticle() {
	return (
		<div className="fixed left-1/2 top-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-reticle pointer-events-none" />
	)
}

const CENTER = new Vector2(0, 0)

export function useReticleInteraction() {
	const raycaster = useRef(new Raycaster())
	const { camera } = useThree()
	const lastHit = useRef<Object3D | null>(null)

	raycaster.current.firstHitOnly = true
	raycaster.current.far = 1

	useFrame(() => {
		raycaster.current.setFromCamera(CENTER, camera)

		const objects = sceneRegistry.getAllObjects()
		const intersections = raycaster.current.intersectObjects(objects, true)

		const hit = intersections[0]?.object ?? null

		if (hit !== lastHit.current) {
			if (lastHit.current) {
				const prevEntityId = lastHit.current.userData.entityId
				if (prevEntityId && game.entities[prevEntityId]?.interaction)
					game.entities[prevEntityId].interaction.isInteracting = false
			}

			if (hit) {
				const entityId = hit.userData.entityId
				if (entityId && game.entities[entityId]?.interaction)
					game.entities[entityId].interaction.isInteracting = true
				game.activeInteractable = entityId ?? null
			} else {
				game.activeInteractable = ''
			}

			lastHit.current = hit
			game.activeInteractable = hit?.userData.entityId
		}
	})
}
