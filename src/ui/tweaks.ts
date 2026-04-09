import {
	BindingApi,
	ButtonApi,
	type Bindable,
	type BindingParams,
	type ButtonParams,
} from '@tweakpane/core'
import { useEffect, useRef, useState } from 'react'
import { Pane, type FolderApi, type FolderParams as TweakpaneFolderParams } from 'tweakpane'

// Singleton pane instance

const isBrowser = typeof document !== 'undefined'

export const pane = isBrowser
	? new Pane({ title: 'Tweaks', expanded: false })
	: (undefined as unknown as Pane)
const folderRegistry = new WeakMap<FolderApi | Pane, Map<string, FolderApi>>()

type Folders = '💡 Lights' | '🕒 Time'
type FolderName = Folders[number] | (string & {})
type FolderParams = Omit<TweakpaneFolderParams, 'title'> & { title: FolderName }

type BindingParam<T extends Bindable> = {
	param: T
	key?: keyof T
	options?: BindingParams
}

function ensureRegistry(parent: FolderApi | Pane) {
	if (!folderRegistry.has(parent)) {
		folderRegistry.set(parent, new Map())
	}
	return folderRegistry.get(parent)!
}

function getOrCreateFolder(
	parent: FolderApi | Pane,
	{ title, ...params }: FolderParams,
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

export function useAddBinding<T extends Bindable>({
	folder,
	param,
	key,
	options,
}: {
	folder: FolderApi
} & BindingParam<T>) {
	const [value, setValue] = useState<T>(() => (param.clone ? param.clone() : param))
	const bindingRef = useRef<BindingApi<unknown, unknown> | null>(null)
	const paramsRef = useRef([param, key ?? (Object.keys(param)[0] as keyof T), options] as const)
	const folderRef = useRef(folder)

	useEffect(() => {
		bindingRef.current = folderRef.current
			.addBinding(...paramsRef.current)
			.on('change', ({ value }) =>
				setValue((prev) => ({
					...prev,
					[paramsRef.current[1]]: value.clone ? value.clone() : value,
				})),
			)
		const cleanupFolder = folderRef.current
		return () => {
			if (bindingRef.current) cleanupFolder.remove(bindingRef.current)
		}
	}, [])

	return value
}

export function useAddBindings<T extends Bindable>({
	folder,
	bindings,
}: {
	folder: FolderApi
	bindings: BindingParam<T>[]
}) {
	const defsRef = useRef<BindingParam<T>[]>(
		bindings.map(({ param, key, options }) => ({
			id: Symbol(),
			param,
			key: key ?? (Object.keys(param)[0] as keyof T),
			options,
		})),
	)

	const [values, setValues] = useState(() =>
		defsRef.current.map(({ param }) => (param.clone ? param.clone() : { ...param })),
	)

	const folderRef = useRef(folder)

	useEffect(() => {
		const created: BindingApi<unknown, unknown>[] = []

		defsRef.current.forEach((def, index) => {
			const key = def.key ?? (Object.keys(def.param)[0] as keyof T)
			const binding = folderRef.current
				.addBinding(def.param, key, def.options)
				.on('change', ({ value }) => {
					setValues((prev) =>
						prev.map((v, i) =>
							i === index
								? {
										...v,
										[key]: value?.clone ? value.clone() : value,
									}
								: v,
						),
					)
				})

			created.push(binding)
		})

		const folders = folderRef.current

		return () => {
			created.forEach((b) => folders.remove(b))
		}
	}, [])

	return values
}

export function useAddButton({
	folder,
	onClick,
	...params
}: { folder: FolderApi; onClick?: (target: ButtonApi) => void } & ButtonParams) {
	const [value, setValue] = useState(false)
	const buttonRef = useRef<ButtonApi | null>(null)
	const paramsRef = useRef(params)
	const onClickRef = useRef(onClick)
	const folderRef = useRef(folder)

	useEffect(() => {
		buttonRef.current = folderRef.current.addButton(paramsRef.current).on('click', ({ target }) => {
			onClickRef.current?.(target)
			setValue((prev) => !prev)
		})
		const cleanupFolder = folderRef.current
		return () => {
			if (buttonRef.current) cleanupFolder.remove(buttonRef.current)
		}
	}, [])

	return value
}
