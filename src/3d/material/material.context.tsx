import { useTexture } from '@react-three/drei'
import { createContext, type ReactNode, useContext, useMemo } from 'react'
import {
	MeshStandardMaterial,
	NearestFilter,
	type Texture,
	type TextureEventMap,
} from 'three/src/Three.js'

type MaterialContextType = {
	material: MeshStandardMaterial
	texture: { map: Texture<unknown, TextureEventMap> }
}

const MaterialContext = createContext<MaterialContextType | null>(null)

export function MaterialProvider({
	textureFilepath,
	children,
}: {
	textureFilepath: string
	children: ReactNode
}) {
	const texture = useColorPalette(textureFilepath)
	const material = useMemo(() => new MeshStandardMaterial({ map: texture }), [texture])

	return (
		<MaterialContext.Provider value={{ material, texture: { map: texture } }}>
			{children}
		</MaterialContext.Provider>
	)
}

export function useTextureMaterial() {
	const context = useContext(MaterialContext)
	if (!context) throw new Error('useTextureMaterial must be used within a MaterialProvider.')
	return context
}

export function useColorPalette(palette: string) {
	return useTexture(palette, (texture) => {
		texture.flipY = false
		texture.magFilter = NearestFilter
	})
}
