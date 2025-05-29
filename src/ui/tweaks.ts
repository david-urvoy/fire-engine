import type { BindingApi, BindingParams, BladeApi } from '@tweakpane/core'
import { useEffect, useMemo, useRef, useState } from 'react'
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
	onChange?: (event: { value: V }) => void
	title?: string
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
	const bindingObjectsRef = useRef<Record<string, { [key: string]: unknown }>>({})
	const isInitializedRef = useRef(false)

	// Memoize bindings to prevent unnecessary re-runs
	const memoizedBindings = useMemo(() => bindings, [bindings])

	useEffect(() => {
		// Create folder if it doesn't exist
		if (!folders[folderName]) {
			folders[folderName] = pane.addFolder({ title: folderName })
		}

		// Handle function-based or object-based bindings
		if (typeof memoizedBindings === 'function') {
			bladesRef.current = memoizedBindings(folders[folderName]).map((binding) => {
				if (isBindingApi(binding)) {
					binding.on('change', (event) => {
						setValues((prev) => ({ ...prev, [binding.key]: event.value }))
					})
				}
				return binding
			})
		} else {
			// Object-based bindings
			const bindingsMap = memoizedBindings as TweaksBindingMap
			const initialValues: Record<string, unknown> = {}

			bladesRef.current = Object.entries(bindingsMap).map(([key, { value, params, onChange, title }]) => {
				// Create binding object for this key
				const bindingObject = { [key]: value }
				bindingObjectsRef.current[key] = bindingObject
				initialValues[key] = value

				// Add binding with optional title override
				const bindingParams = title ? { ...params, label: title } : params
				const binding = folders[folderName].addBinding(bindingObject, key, bindingParams)

				binding.on('change', (event) => {
					onChange?.(event)
					setValues((prev) => ({ ...prev, [key]: event.value }))
				})

				return binding
			})

			// Set initial values only once
			if (!isInitializedRef.current) {
				setValues(initialValues as R)
				isInitializedRef.current = true
			}
		}

		// Cleanup function
		return () => {
			for (const blade of bladesRef.current) {
				try {
					folders[folderName]?.remove(blade)
				} catch (error) {
					// Ignore errors if blade is already removed or folder is disposed
					console.warn('Error removing blade:', error)
				}
			}
			bladesRef.current = []
			bindingObjectsRef.current = {}

			// Remove folder if empty and it still exists
			if (folders[folderName] && folders[folderName].children.length === 0) {
				try {
					folders[folderName].dispose()
					delete folders[folderName]
				} catch (error) {
					// Ignore errors if folder is already disposed
					console.warn('Error disposing folder:', error)
				}
			}
		}
	}, [folderName, memoizedBindings]) // Include folderName in dependencies

	// Update tweakpane when external values change
	useEffect(() => {
		if (!isInitializedRef.current || typeof memoizedBindings === 'function') return

		const bindingsMap = memoizedBindings as TweaksBindingMap

		for (const [key, { value }] of Object.entries(bindingsMap)) {
			const bindingObject = bindingObjectsRef.current[key]
			if (bindingObject && bindingObject[key] !== value) {
				// Update the binding object
				bindingObject[key] = value
				// Find the corresponding blade and refresh it
				const blade = bladesRef.current.find((b) => isBindingApi(b) && b.key === key)
				if (blade && isBindingApi(blade)) {
					try {
						blade.refresh()
					} catch (error) {
						// Ignore errors if blade is disposed
						console.warn('Error refreshing blade:', error)
					}
				}
			}
		}
	}, [memoizedBindings]) // Use memoized bindings

	// Function to refresh all bindings
	const refreshBindings = () => {
		for (const blade of bladesRef.current) {
			if (isBindingApi(blade)) {
				try {
					blade.refresh()
				} catch (error) {
					// Ignore errors if blade is disposed
					console.warn('Error refreshing blade:', error)
				}
			}
		}
	}

	return [values, refreshBindings]
}
