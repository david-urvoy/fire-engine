import type { BindingApi, BladeApi, FolderParams } from '@tweakpane/core'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { FolderApi } from 'tweakpane'
import { pane } from '../tweaks'

const folderNames = ['💡 Lights', '🕒 Time'] as const
export type FOLDERS = (typeof folderNames)[number] | (string & {})

const folders: Record<string, FolderApi> = {}

function isBindingApi(blade: BladeApi): blade is BindingApi<unknown, unknown> {
	return 'refresh' in blade
}

export function addFolder({ title, ...params }: Omit<FolderParams, 'title'> & { title: FOLDERS }): FolderApi {
	if (!folders[title]) {
		folders[title] = pane.addFolder({ title, expanded: false, ...params })
	}
	return folders[title]
}

export function useTweaksBase<R extends BladeApi[]>({ title, ...params }: FolderParams) {
	const bladesRef = useRef<R | null>(null)

	const folder = useMemo(() => addFolder({ title, ...params }), [title, params])

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
