import type { BindingApi, BindingParams, BladeApi } from '@tweakpane/core'
import { useEffect, useRef, useState } from 'react'
import { type FolderApi, Pane } from 'tweakpane'

const folderNames = ['💡 Lights', '🕒 Time'] as const
type FOLDERS = (typeof folderNames)[number] | (string & {})

export const pane = new Pane()
const folders: Record<string, FolderApi> = {}

type ResolveResult<B> = B extends TweaksBindingMap ? ExtractValues<B> : string

export function useTweaks<B extends TweaksBindingMap | Record<string, unknown>, R extends ResolveResult<B>>({
	folder: folderName,
	bindings,
}: { folder: FOLDERS; bindings: ((folder: FolderApi) => BladeApi[]) | B }) {
	const [values, setValues] = useState<R>({} as R)
	const bladesRefs = useRef<BladeApi[]>([])

	useEffect(() => {
		if (!folders[folderName]) {
			folders[folderName] = pane.addFolder({ title: folderName })
		}

		bladesRefs.current =
			typeof bindings === 'function'
				? bindings(folders[folderName]).map((binding) => {
						isBindingApi(binding) && binding.on('change', (event) => setValues(event.value as R))
						return binding
					})
				: Object.entries(bindings as TweaksBindingMap).map(([key, { value, params, onChange }]) =>
						folders[folderName].addBinding({ [key]: value }, key, params).on('change', (event) => {
							onChange?.(event.value)
							setValues({ [key]: event.value } as R)
						}),
					)

		return () => {
			for (const blade of bladesRefs.current) {
				folders[folderName]?.remove(blade)
			}
			bladesRefs.current = []

			if (folders[folderName]?.children.length === 0) {
				folders[folderName]?.dispose()
				delete folders[folderName]
			}
		}
	}, [folderName, bindings])

	return [
		values,
		() => bladesRefs.current.filter((blade) => isBindingApi(blade)).map((blade) => blade.refresh()),
	] as const
}

type DeclarativeBindingDefinition<V> = {
	value: V
	params?: BindingParams
	onChange?: (value: V) => void
}

type TweaksBindingMap = Record<string, DeclarativeBindingDefinition<unknown>>

type ExtractValues<B extends TweaksBindingMap> = {
	[K in keyof B]: B[K]['value']
}

function isBindingApi<T>(blade: BladeApi): blade is BindingApi<unknown, T> {
	return 'refresh' in blade
}
