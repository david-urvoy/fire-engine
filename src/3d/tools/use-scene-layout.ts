import { folder, useControls } from 'leva'

export function useSceneLayout({
	name,
	position,
	dimension,
	debug = false,
}: {
	name: string
	position?: [number, number, number]
	dimension?: [number, number, number]
	debug?: boolean
}) {
	return useControls('🪲 Debug', {
		'🎬 Scene layout': folder({
			[name]: folder(
				{
					dimension: { value: dimension ?? [1, 1, 1], step: 0.1, render: () => !!dimension },
					position: { value: { x: position?.[0] ?? 0, z: position?.[2] ?? 0 }, step: 0.1 },
					vertical: { value: position?.[1] ?? 0, step: 0.1 },
				},
				{
					render: () => debug,
					collapsed: true,
				},
			),
		}),
	})
}
