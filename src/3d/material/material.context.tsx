import { folder, useControls } from 'leva'
import { createContext, useContext, useMemo, type PropsWithChildren } from 'react'
import { MeshStandardMaterial } from 'three'

type VariantConfig = {
	color: string
	roughness: number
	metalness: number
	emissive?: string
	emissiveIntensity?: number
}

type MaterialGroupConfig = {
	emoji: string
	variants: Record<string, VariantConfig>
}

export type MaterialsConfig = Record<string, MaterialGroupConfig>

function generateControlsSchema(materialsConfig: MaterialsConfig) {
	return Object.fromEntries(
		Object.entries(materialsConfig).map(([groupName, group]) => {
			const groupControls: Record<string, any> = {}

			for (const [variantName, config] of Object.entries(group.variants)) {
				const matControls = {
					[`color_${groupName}_${variantName}`]: config.color,
					[`roughness_${groupName}_${variantName}`]: {
						value: config.roughness,
						min: 0,
						max: 1,
						step: 0.01,
					},
					[`metalness_${groupName}_${variantName}`]: {
						value: config.metalness,
						min: 0,
						max: 1,
						step: 0.01,
					},
				}

				if (config.emissive) {
					matControls[`emissive_${groupName}_${variantName}`] = config.emissive
					matControls[`intensity_${groupName}_${variantName}`] = {
						value: config.emissiveIntensity!,
						min: 0,
						max: 1,
						step: 0.01,
					}
				}

				groupControls[variantName] = folder(matControls, { collapsed: true })
			}

			const groupFolderName = `${group.emoji} ${groupName}`
			return [groupFolderName, folder(groupControls, { collapsed: true })]
		}),
	)
}

function getMaterialName(groupName: string, variantName: string): string {
	if (variantName === 'Medium') return groupName
	if (['Emissive', 'Plastic'].includes(variantName)) return `${variantName}_${groupName}`

	return `${groupName}_${variantName}`
}

function createMaterialsFromControls(
	materialsConfig: MaterialsConfig,
	controls: Record<string, any>,
): Record<string, MeshStandardMaterial> {
	const materials: Record<string, MeshStandardMaterial> = {}

	for (const [groupName, group] of Object.entries(materialsConfig)) {
		for (const [variantName, config] of Object.entries(group.variants)) {
			const materialName = getMaterialName(groupName, variantName)

			const colorKey = `color_${groupName}_${variantName}`
			const roughnessKey = `roughness_${groupName}_${variantName}`
			const metalKey = `metalness_${groupName}_${variantName}`
			const emissiveKey = `emissive_${groupName}_${variantName}`
			const intensityKey = `intensity_${groupName}_${variantName}`

			const materialProps: Record<string, any> = {
				color: String(controls[colorKey]),
				roughness: Number(controls[roughnessKey]),
				metalness: Number(controls[metalKey]),
			}

			if (config.emissive && emissiveKey in controls && intensityKey in controls) {
				materialProps.emissive = String(controls[emissiveKey])
				materialProps.emissiveIntensity = Number(controls[intensityKey])
			}

			materials[materialName] = new MeshStandardMaterial({
				...materialProps,
			})
		}
	}

	return materials
}

type MaterialsContextType<Key extends string> = Record<Key, MeshStandardMaterial>

const MaterialsContext = createContext<MaterialsContextType<string> | undefined>(undefined)

export function MaterialsProvider({
	materialsConfig,
	children,
}: PropsWithChildren<{ materialsConfig: MaterialsConfig }>) {
	const controls = useControls('🎨 Materials', generateControlsSchema(materialsConfig), {
		collapsed: true,
	})

	const materials = useMemo(() => {
		return createMaterialsFromControls(materialsConfig, controls)
	}, [controls, materialsConfig])

	return <MaterialsContext.Provider value={materials}>{children}</MaterialsContext.Provider>
}

export function useMaterials<MaterialKey extends string>(): MaterialsContextType<MaterialKey> {
	const materials = useContext(MaterialsContext)

	if (!materials) throw new Error('useMaterials must be used within a MaterialsProvider.')

	return materials
}
