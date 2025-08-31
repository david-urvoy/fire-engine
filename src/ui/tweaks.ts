import { BindingApi, ButtonApi, type ButtonParams } from '@tweakpane/core'
import { useEffect, useRef, useState } from 'react'
import { Pane, type FolderApi, type FolderParams as TweakpaneFolderParams } from 'tweakpane'

// Singleton pane instance

export const pane = new Pane({ title: "Tweaks", expanded: false })
const folderRegistry = new WeakMap<FolderApi | Pane, Map<string, FolderApi>>()

type Folders = '💡 Lights' | '🕒 Time'
type FolderName = Folders[number] | (string & {})
type FolderParams = Omit<TweakpaneFolderParams, 'title'> & { title: FolderName }

function ensureRegistry(parent: FolderApi | Pane) {
	if (!folderRegistry.has(parent)) {
		folderRegistry.set(parent, new Map())
	}
	return folderRegistry.get(parent)!
}

function getOrCreateFolder(
	parent: FolderApi | Pane,
	{ title, ...params }: FolderParams
): FolderApi {
	const reg = ensureRegistry(parent)
	if (!reg.has(title)) {
		const newFolder = parent.addFolder({ title, ...params })
		reg.set(title, newFolder)
		return newFolder
	}
	return reg.get(title)!
}

export const Tweaks = {
	folder(args: FolderParams, parent: FolderApi | Pane = pane) {
		const newFolder = getOrCreateFolder(parent, args)

		return Object.assign(newFolder, {
			folder: (childArgs: FolderParams) => Tweaks.folder(childArgs, newFolder),
		})
	},
}

export function useAddBinding<T>({ folder, params }: { folder: FolderApi, params: Parameters<FolderApi['addBinding']> }) {
	const [value, setValue] = useState<T>(() => {
		// @ts-ignore
		const initial = params[0][Object.keys(params[0])[0]] as T
		// @ts-ignore
		return initial.clone ? initial.clone() : initial
	}
	)
	const bindingRef = useRef<BindingApi<unknown, unknown> | null>(null)
	const paramsRef = useRef(params)
	const folderRef = useRef(folder)

	useEffect(() => {
		bindingRef.current = folderRef.current.addBinding(...paramsRef.current)
			.on('change', ({ value }) => setValue(value.clone ? value.clone() : value))
		const cleanupFolder = folderRef.current
		return () => {
			if (bindingRef.current)
				cleanupFolder.remove(bindingRef.current)
		}
	}, [])

	return value
}

export function useAddButton({ folder, onClick, params }: { folder: FolderApi, onClick?: (target: ButtonApi) => void, params: ButtonParams }) {
	const [value, setValue] = useState(false)
	const buttonRef = useRef<ButtonApi | null>(null)
	const paramsRef = useRef(params)
	const onClickRef = useRef(onClick)
	const folderRef = useRef(folder)

	useEffect(() => {
		buttonRef.current = folderRef.current.addButton(paramsRef.current)
			.on('click', ({ target }) => {
				onClickRef.current?.(target)
				setValue(prev => !prev)
			})
		const cleanupFolder = folderRef.current
		return () => {
			if (buttonRef.current)
				cleanupFolder.remove(buttonRef.current)
		}
	}, [])

	return value
}
