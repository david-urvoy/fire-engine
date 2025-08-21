import { BindingApi, ButtonApi, type ButtonParams } from '@tweakpane/core'
import { useEffect, useRef, useState } from 'react'
import { Pane, type FolderApi, type FolderParams as TweakpaneFolderParams } from 'tweakpane'

// Singleton pane instance
export const pane = new Pane({ title: "Tweaks", expanded: false })
export const folders: Record<string, FolderApi> = {}

type Folders = '💡 Lights' | '🕒 Time'
type FolderName = Folders[number] | (string & {})
type FolderParams = Omit<TweakpaneFolderParams, 'title'> & { title: FolderName }

export const Tweaks = {
	folder({ title, folder, ...params }: FolderParams & { folder?: FolderApi }): FolderApi {
		if (!folders[title]) {
			folders[title] = folder ? folder.addFolder({ title, ...params }) : pane.addFolder({ title, ...params })
		}
		return folders[title]
	}
}

function tweaks(folder: FolderApi) {
	return {
		addBinding: <T>({ params }: { params: Parameters<FolderApi['addBinding']> }) => {
			const [value, setValue] = useState<T>(
				params[0][Object.keys(params[0])[0]]
			)
			const bindingRef = useRef<BindingApi<unknown, unknown> | null>(null)

			useEffect(() => {
				bindingRef.current = folder.addBinding(...params)
					.on('change', ({ value }) => setValue(value))
				return () => {
					if (bindingRef.current)
						folder.remove(bindingRef.current)
				}
			}, [])

			return value
		},
		addButton: ({ onClick, params }: { onClick?: (target: ButtonApi) => void, params: ButtonParams }) => {
			const [value, setValue] = useState(false)
			const buttonRef = useRef<ButtonApi | null>(null)

			useEffect(() => {
				buttonRef.current = folder.addButton(params)
					.on('click', ({ target }) => {
						onClick?.(target)
						setValue(prev => !prev)
					})
				return () => {
					if (buttonRef.current)
						folder.remove(buttonRef.current)
				}
			}, [])

			return value
		},
		addFolder: (args: FolderParams) => tweaks(Tweaks.folder({ folder, ...args })),
	}
}

export function useTweaks(args: FolderParams) {
	return tweaks(Tweaks.folder(args))
}
