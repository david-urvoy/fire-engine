import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Raycaster, Vector2, type Object3D } from 'three'
import { interactable } from '../three/world/objects/interactable/interactable.store'

export function Reticle() {
	return <div className="fixed left-1/2 top-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-reticle pointer-events-none" />
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


		const intersections = raycaster.current.intersectObjects(
			Array.from(interactable._map.values()),
			true
		)

		const hit = intersections[0]?.object ?? null

		if (hit !== lastHit.current) {
			if (lastHit.current) {
				interactable.active.delete(lastHit.current.uuid)
			}

			if (hit && intersections[0] && intersections[0]?.distance < 3) {
				interactable.active.add(hit.uuid)
			}


			lastHit.current = hit
		}
	})
}
