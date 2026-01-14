import { useThree } from '@react-three/fiber'
import type { RefObject } from 'react'
import { type Material, type Mesh, Raycaster, type Vector3 } from 'three'

export const useXRay = (target: RefObject<Vector3>) => {
	const { scene, camera } = useThree()
	const transparentElements: Map<string, Mesh> = new Map()
	const raycaster = new Raycaster(
		camera.position,
		target.current.sub(camera.position).normalize(),
		0,
		10,
	)
	return () => {
		const intersectedElementsIds: string[] = []
		scene.traverse((object) => {
			if (object.type === 'Mesh') {
				const intersection = raycaster.intersectObject(object)
				if (intersection && intersection.length > 0) {
					;((object as Mesh).material as Material).opacity = 0.5
					intersectedElementsIds.push(object.uuid)
					transparentElements.set(object.uuid, object as Mesh)
				} else {
					for (const key of Array.from(transparentElements.keys())) {
						if (!intersectedElementsIds.includes(key)) {
							const element = transparentElements.get(key)
							if (element) (element.material as Material).opacity = 1
							transparentElements.delete(key)
						}
					}
				}
			}
		})
	}
}
