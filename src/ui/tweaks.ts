import {
	BindingApi,
	ButtonApi,
	type Bindable,
	type BindingParams,
	type BladeApi,
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
	BindingParams): T {
	return useAddBindings({
		folder,
		bindings: [binding({ param, key, options, onChange })] as const,
	})
}

function isBinding(item: unknown): item is BindingParam<Bindable> & { __binding: true } {
	return typeof item === 'object' && item !== null && '__binding' in item
}

function isSeparator(item: unknown): item is { __separator: true } {
	return typeof item === 'object' && item !== null && '__separator' in item
}

export const binding = <T extends Bindable>(
	def: BindingParam<T> & BindingParams,
): BindingParam<T> & { __binding: true } => ({
	...def,
	__binding: true,
})

export const separator = (): { __separator: true } => ({
	__separator: true,
})

type IsBinding<T> = T extends { __binding: true } ? true : false
type ExtractBindingParams<T> = T extends BindingParam<infer P> & { __binding: true } ? P : never

type AccumulateBindingTypes<T extends readonly any[]> = T extends readonly [
	infer First,
	...infer Rest,
]
	? IsBinding<First> extends true
		? ExtractBindingParams<First> & AccumulateBindingTypes<Rest>
		: AccumulateBindingTypes<Rest>
	: {}

export function useAddBindings<T extends Bindable>(config: {
	folder: FolderApi
	bindings: readonly [BindingParam<T> & { __binding: true }]
}): T

export function useAddBindings<
	const T extends readonly (
		| (BindingParam<Bindable> & { __binding: true })
		| { __separator: true }
	)[],
>(config: { folder: FolderApi; bindings: T }): AccumulateBindingTypes<T>

export function useAddBindings<
	const T extends readonly (
		| (BindingParam<Bindable> & { __binding: true })
		| { __separator: true }
	)[],
>({ folder, bindings }: { folder: FolderApi; bindings: T }): any {
	const [values, setValues] = useState(() => {
		const result: Record<string, unknown> = {}
		bindings.forEach((item) => {
			if (isBinding(item)) {
				const key = item.key ?? (Object.keys(item.param)[0] as keyof Bindable)
				result[String(key)] = item.param[key]
			}
		})
		return result
	})

	useEffect(() => {
		const created: (BindingApi<unknown, unknown> | BladeApi)[] = []

		bindings.forEach((item) => {
			if (isSeparator(item)) {
				const separator = folder.addBlade({ view: 'separator' })
				created.push(separator)
			} else if (isBinding(item)) {
				const key = item.key ?? (Object.keys(item.param)[0] as keyof Bindable)
				const binding = folder
					.addBinding(item.param, key, item.options)
					.on('change', ({ value }) => {
						setValues((prev) => ({
							...prev,
							[String(key)]: value?.clone ? value.clone() : value,
						}))
						item.onChange?.(value)
					})
				created.push(binding)
			}
		})

		return () => {
			created.forEach((b) => {
				if (b) folder.remove(b)
			})
		}
	}, [folder, bindings])

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
