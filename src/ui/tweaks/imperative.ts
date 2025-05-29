import type { BladeApi } from '@tweakpane/core'
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
	folder: folderName,
	bindings,
}: {
	folder: FOLDERS
	bindings: (folder: FolderApi) => R
}): [() => void] {
	const { bladesRef, refreshBindings, folder } = useTweaksBase<R>({ folderName })

	useEffect(() => {
		const result = bindings(folder)

		bladesRef.current = result as R
	}, [folder, bladesRef])

	return [refreshBindings]
}
