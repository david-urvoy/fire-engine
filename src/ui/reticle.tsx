import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Raycaster, Vector2, type Object3D } from 'three'

import { game } from '../game'
import { entityManager } from '../game/entity/entity.manager'
import { sceneRegistry } from '../game/system/scene-registry'

export function Reticle() {
	return (
		<div className="shadow-reticle pointer-events-none fixed top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
	)
}

const CENTER = new Vector2(0, 0)

export function useReticleInteraction() {
	const { camera } = useThree()

	const raycaster = useMemo(() => {
		const rc = new Raycaster()
		rc.firstHitOnly = true
		rc.far = 1
		return rc
	}, [])

	const lastHit = useRef<Object3D | null>(null)

	useFrame(() => {
		raycaster.setFromCamera(CENTER, camera)

		const hit = raycaster.intersectObjects(sceneRegistry.getAllObjects(), true)[0]?.object ?? null

		if (hit === lastHit.current) return

		const previousEntity = lastHit.current
			? entityManager.get(lastHit.current.userData.entityId)
			: undefined

		if (previousEntity?.interaction) {
			previousEntity.interaction.isInteracting = false
		}

		const currentEntity = hit ? entityManager.get(hit.userData.entityId) : undefined

		if (currentEntity?.interaction) {
			currentEntity.interaction.isInteracting = true
		}

		lastHit.current = hit

		console.log('currentEntity', currentEntity)

		if (currentEntity) game.setInteractable(currentEntity.id)
		else game.clearInteractable()
	})
}
