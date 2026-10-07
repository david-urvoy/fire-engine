import type { PropsWithChildren } from 'react'
import type { Mesh } from 'three'
import { mergeBufferGeometries } from 'three-stdlib'

type MergedGeometriesProps = {
	meshes: { mesh: Mesh; update?: (mesh: Mesh) => void }[]
} & Partial<Mesh>

export function MergedGeometries({ meshes, ...props }: PropsWithChildren<MergedGeometriesProps>) {
	const geometries = mergeBufferGeometries(
		meshes.map(({ mesh, update }) => {
			const geometry = mesh.geometry.clone()

			update?.(mesh)
			mesh.updateWorldMatrix(true, false)
			geometry.applyMatrix4(mesh.matrixWorld)

			return geometry
		}),
	)

	if (!geometries) return null

	return <mesh {...props} geometry={geometries} />
}
