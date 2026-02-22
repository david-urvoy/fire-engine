import { useAnimations, useGLTF } from '@react-three/drei'
import { useGraph } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { AnimationClip } from 'three'
import { SkeletonUtils, type GLTF } from 'three-stdlib'

interface GLTFData extends GLTF {
	nodes: Record<string, unknown>
	materials: Record<string, unknown>
}

interface GLTFAction<ActionName extends string> extends AnimationClip {
	name: ActionName
}

export function useSkinnedMeshGLTF<GLTFResult extends GLTFData, ActionName extends string>(
	filepath: string,
) {
	const group = useRef(null)
	const gltf = useGLTF(filepath) as unknown as GLTFResult
	const { scene, animations } = gltf

	const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
	const { nodes } = useGraph(clone)
	const { actions } = useAnimations(animations as GLTFAction<ActionName>[], clone)

	return { ...gltf, actions, nodes, group }
}
