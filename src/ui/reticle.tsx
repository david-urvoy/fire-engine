import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Raycaster, Vector2, type Object3D } from 'three'

import { game, INTERACTION_MAX_DISTANCE } from '../game'
import { LAYERS } from '../lib/enums/layers'

export function Reticle() {
	return (
		<div className="pointer-events-none fixed top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
	)
}

const CENTER = new Vector2(0, 0)

export function useReticleInteraction() {
	const { camera } = useThree()

	const raycaster = useMemo(() => {
		const rc = new Raycaster()
		rc.layers.set(LAYERS.INTERACTABLE)
		rc.firstHitOnly = true
		rc.far = INTERACTION_MAX_DISTANCE
		return rc
	}, [])

	const lastHit = useRef<Object3D | null>(null)

	useFrame(({ scene }) => {
		raycaster.setFromCamera(CENTER, camera)

		const hit = raycaster.intersectObject(scene, true)[0]?.object ?? null

		if (hit === lastHit.current) return

		if (!hit && lastHit.current) {
			lastHit.current.userData.isInteracting = false
			game.interactable.clear()
		}

		if (hit) {
			hit.userData.isInteracting = true
			game.interactable.set(hit.userData.entityId)
		}

		lastHit.current = hit
	})
}
