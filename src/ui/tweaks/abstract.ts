import type { BindingApi, BladeApi } from '@tweakpane/core'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { FolderApi } from 'tweakpane'
import { pane } from '../tweaks'

const folderNames = ['💡 Lights', '🕒 Time'] as const
export type FOLDERS = (typeof folderNames)[number] | (string & {})

const folders: Record<string, FolderApi> = {}

function isBindingApi(blade: BladeApi): blade is BindingApi<unknown, unknown> {
	return 'refresh' in blade
}

export function useTweaksBase<R extends BladeApi[]>({ folderName }: { folderName: FOLDERS }) {
	const bladesRef = useRef<R | null>(null)

	const folder = useMemo(() => {
		if (!folders[folderName]) {
			folders[folderName] = pane.addFolder({ title: folderName })
		}
		return folders[folderName]
	}, [folderName])

	useEffect(() => () => {
		if (!bladesRef.current) return
		for (const blade of bladesRef.current) folder?.remove(blade)
		bladesRef.current = null
	}, [folder])

	const refreshBindings = useCallback(() => {
		if (!bladesRef.current) return
		for (const blade of bladesRef.current)
			if (isBindingApi(blade))
				blade.refresh()
	}, [])

	return { folder, bladesRef, refreshBindings }
}
