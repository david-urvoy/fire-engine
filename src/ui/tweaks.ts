import type { BindingApi, BindingParams, BladeApi } from '@tweakpane/core'
import { useEffect, useRef, useState } from 'react'
import { type FolderApi, Pane } from 'tweakpane'

// Define folder names as constants for better autocomplete
const folderNames = ['💡 Lights', '🕒 Time'] as const
type FOLDERS = (typeof folderNames)[number] | (string & {})

// Singleton pane instance
export const pane = new Pane()
const folders: Record<string, FolderApi> = {}

// Type definitions
type DeclarativeBindingDefinition<V> = {
	value: V
	params?: BindingParams
	onChange?: (value: V) => void
}

type TweaksBindingMap = Record<string, DeclarativeBindingDefinition<unknown>>

type ExtractValues<B extends TweaksBindingMap> = {
	[K in keyof B]: B[K]['value']
}

type ResolveResult<B> = B extends TweaksBindingMap ? ExtractValues<B> : Record<string, unknown>

// Type guard
function isBindingApi(blade: BladeApi): blade is BindingApi<unknown, unknown> {
	return 'refresh' in blade
}

/**
 * React hook for integrating Tweakpane with React components
 *
 * @param options - Hook configuration
 * @param options.folder - Name of the folder to add bindings to
 * @param options.bindings - Either a function that creates bindings or a binding map
 * @returns [values, refreshBindings] - Current values and a function to refresh bindings
 */
export function useTweaks<B extends TweaksBindingMap | Record<string, unknown>, R extends ResolveResult<B>>({
	folder: folderName,
	bindings,
}: {
	folder: FOLDERS
	bindings: ((folder: FolderApi) => BladeApi[]) | B
}): [R, () => void] {
	const [values, setValues] = useState<R>({} as R)
	const bladesRef = useRef<BladeApi[]>([])
	const initialValuesRef = useRef<R>({} as R)

	useEffect(() => {
		// Create folder if it doesn't exist
		if (!folders[folderName]) {
			folders[folderName] = pane.addFolder({ title: folderName })
		}

		// Handle function-based or object-based bindings
		if (typeof bindings === 'function') {
			bladesRef.current = bindings(folders[folderName]).map((binding) => {
				if (isBindingApi(binding)) {
					binding.on('change', (event) => {
						setValues((prev) => ({ ...prev, [binding.key]: event.value }))
					})
				}
				return binding
			})
		} else {
			// Object-based bindings
			const bindingsMap = bindings as TweaksBindingMap
			const initialValues: Record<string, unknown> = {}

			bladesRef.current = Object.entries(bindingsMap).map(([key, { value, params, onChange }]) => {
				initialValues[key] = value

				return folders[folderName].addBinding({ [key]: value }, key, params).on('change', (event) => {
					onChange?.(event.value)
					setValues((prev) => ({ ...prev, [key]: event.value }))
				})
			})

			// Set initial values
			if (Object.keys(initialValuesRef.current).length === 0) {
				initialValuesRef.current = initialValues as R
				setValues(initialValues as R)
			}
		}

		// Cleanup function
		return () => {
			for (const blade of bladesRef.current) {
				folders[folderName]?.remove(blade)
			}
			bladesRef.current = []

			// Remove folder if empty
			if (folders[folderName]?.children.length === 0) {
				folders[folderName].dispose()
				delete folders[folderName]
			}
		}
	}, [folderName, bindings])

	// Function to refresh all bindings
	const refreshBindings = () => {
		for (const blade of bladesRef.current) {
			if (isBindingApi(blade)) {
				blade.refresh()
			}
		}
	}

	return [values, refreshBindings]
}
