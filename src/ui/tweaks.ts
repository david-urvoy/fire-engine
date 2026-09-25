import {
	BindingApi,
	ButtonApi,
	type Bindable,
	type BindingParams,
	type ButtonParams,
} from '@tweakpane/core'
import { useEffect, useRef, useState } from 'react'
import { Pane, type FolderApi, type FolderParams as TweakpaneFolderParams } from 'tweakpane'

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
	onChange?: (value: T[keyof T]) => void
}

function getOrCreateFolder(
	parent: FolderApi | Pane,
	{ title, ...params }: FolderParams,
): FolderApi {
	const reg = folderRegistry.getOrInsert(parent, new Map())
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
	refresh: () => pane.refresh(),
}

export function useAddBinding<T extends Bindable>({
	folder,
	param,
	key,
	options,
	onChange,
}: {
	folder: FolderApi
} & BindingParam<T> &
	BindingParams) {
	const [value, setValue] = useState<T>(() => (param.clone ? param.clone() : param))
	const bindingRef = useRef<BindingApi<unknown, unknown> | null>(null)
	const paramsRef = useRef([param, key ?? (Object.keys(param)[0] as keyof T), options] as const)

	useEffect(() => {
		bindingRef.current = folder.addBinding(...paramsRef.current).on('change', ({ value }) => {
			setValue((prev) => ({
				...prev,
				[paramsRef.current[1]]: value.clone ? value.clone() : value,
			}))
			onChange?.(value)
		})

		return () => {
			if (bindingRef.current) folder.remove(bindingRef.current)
		}
	}, [folder, onChange])

	return value
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never

type ExtractBindingValues<T extends readonly BindingParam<any>[]> = UnionToIntersection<
	T extends readonly { param: infer P }[] ? (P extends Bindable ? P : never) : never
>

export function useAddBindings<T extends readonly BindingParam<Bindable>[]>({
	folder,
	bindings,
}: {
	folder: FolderApi
	bindings: T
}): ExtractBindingValues<T> {
	const defsRef = useRef<(BindingParam<Bindable> & { key: keyof Bindable })[]>(
		bindings.map(({ param, key, options, onChange }) => ({
			param,
			key: key ?? (Object.keys(param)[0] as keyof Bindable),
			options,
			onChange,
		})),
	)

	const [values, setValues] = useState(() => {
		const result: Record<string, unknown> = {}
		bindings.forEach(({ param, key }) => {
			const actualKey = key ?? (Object.keys(param)[0] as keyof Bindable)
			result[String(actualKey)] = param[actualKey]
		})
		return result
	})

	const folderRef = useRef(folder)

	useEffect(() => {
		const created: BindingApi<unknown, unknown>[] = []

		defsRef.current.forEach((def) => {
			const key = def.key
			const binding = folderRef.current
				.addBinding(def.param, key, def.options)
				.on('change', ({ value }) => {
					setValues((prev) => ({
						...prev,
						[String(key)]: value?.clone ? value.clone() : value,
					}))
					def.onChange?.(value)
				})

			created.push(binding)
		})

		const folders = folderRef.current

		return () => {
			created.forEach((b) => folders.remove(b))
		}
	}, [])

	return values as ExtractBindingValues<T>
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
