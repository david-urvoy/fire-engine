import { useControls } from 'leva'
import { MeshStandardMaterial } from 'three'

export function useMaterialControls(groupName: string, config: MeshStandardMaterial) {
	return useControls(
		groupName,
		{
			color: config.color.getStyle(),
			roughness: {
				value: config.roughness,
				min: 0,
				max: 1,
				step: 0.01,
			},
			metalness: {
				value: config.metalness,
				min: 0,
				max: 1,
				step: 0.01,
			},
			emissive: {
				value: config.emissive.getStyle(),
				render: () => Boolean(config.emissive.getStyle()),
			},
			intensity: {
				value: config.emissiveIntensity,
				min: 0,
				max: 1,
				step: 0.01,
				render: () => Boolean(config.emissiveIntensity),
			},
		},
		{ collapsed: true },
	)
}

export function AdjustableMaterial(props: MeshStandardMaterial) {
	const controls = useMaterialControls('Material', props)

	return <meshStandardMaterial {...props} {...controls} />
}
