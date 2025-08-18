import type { BladeApi, FolderParams } from '@tweakpane/core'
import { useEffect } from 'react'
import type { FolderApi } from 'tweakpane'
import { useTweaksBase, type FOLDERS } from './abstract'

/**
 * React hook for integrating Tweakpane with React components
 *
 * @param options - Hook configuration
 * @param options.folder - Name of the folder to add bindings to
 * @param options.bindings - Either a function that creates bindings or a binding map
 * @returns [values, refreshBindings] - Current values and a function to refresh bindings
 */
export function useImperativeTweaks<R extends BladeApi[]>({
	title,
	bindings,
	...params
}: Omit<FolderParams, 'title'> & { title: FOLDERS } & {
	bindings: (folder: FolderApi) => R
}): [() => void] {
	const { bladesRef, refreshBindings, folder } = useTweaksBase<R>({ title, ...params })

	useEffect(() => {
		const result = bindings(folder)

		bladesRef.current = result as R
	}, [folder, bladesRef])

	return [refreshBindings]
}
