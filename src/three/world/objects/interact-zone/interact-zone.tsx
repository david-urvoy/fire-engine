import type { JSX } from 'react'
import { PlaneGeometry, ShaderMaterial, Vector3 } from 'three'
import fragmentShader from './fragment-shader.glsl'
import vertexShader from './vertex-shader.glsl'

const planeGeometry = new PlaneGeometry(3, 3)

export function InteractZone({
	offset,
	hovered,
	onPointerOver,
	onPointerOut,
}: { offset: number; hovered: boolean } & JSX.IntrinsicElements['group']) {
	const shaderMaterial = new ShaderMaterial({
		fragmentShader,
		vertexShader,
		transparent: true,
		uniforms: {
			uColor: { value: hovered ? new Vector3(0, 1, 1) : new Vector3(1, 0, 1) },
		},
	})
	return (
		<mesh
			geometry={planeGeometry}
			material={shaderMaterial}
			rotation={[-Math.PI / 2, 0, 0]}
			position-y={-offset}
			onPointerOver={onPointerOver}
			onPointerOut={onPointerOut}
		/>
	)
}
