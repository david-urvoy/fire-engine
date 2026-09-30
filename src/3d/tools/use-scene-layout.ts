import { folder, useControls } from 'leva'

export function useSceneLayout({
	name,
	folder: folderName,
	position,
	dimension: dimensionInput,
	debug = false,
}: {
	name?: string
	folder: string
	position?: [number, number, number]
	dimension?: [number, number, number]
	debug?: boolean
}) {
	const baseConfig = {
		dimension: {
			value: dimensionInput ?? [1, 1, 1],
			step: 0.1,
			render: () => !!dimensionInput,
		},
		horizontal: {
			value: { x: position?.[0] ?? 0, z: position?.[2] ?? 0 },
			step: 0.1,
		},
		vertical: { value: position?.[1] ?? 0, step: 0.1 },
	}

	const config = name ? { [name]: folder(baseConfig) } : baseConfig

	const { dimension, horizontal, vertical } = useControls(
		'🪲 Debug',
		{
			'🎬 Scene layout': folder(
				{
					[folderName]: folder(config, { collapsed: true, render: () => debug }),
				},
				{ collapsed: true },
			),
		},
		{ collapsed: true },
	)

	return { dimension, position: [horizontal.x, vertical, horizontal.z] } as const
}
