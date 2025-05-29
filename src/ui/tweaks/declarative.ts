import type { BindingParams } from '@tweakpane/core'
import { useEffect, useRef } from 'react'
import { useTweaksBase } from './abstract'

// Type definitions
type DeclarativeBindingDefinition<V = unknown> = {
	value: V
	params?: BindingParams
	onChange?: (event: { value: V }) => void
	title?: string
}

type TweaksBindingMap<V = unknown> = Record<string, DeclarativeBindingDefinition<V>>

export function useDeclarativeTweaks<B extends TweaksBindingMap>({
	folder: folderName,
	bindings,
}: {
	folder: string
	bindings: B
}): [() => void] {
	const { folder, bladesRef, refreshBindings } = useTweaksBase({ folderName })
	const isInitializedRef = useRef(false)

	useEffect(() => {

		bladesRef.current = Object.entries(bindings).map(([key, { value, params, onChange, title }]) => {
			const bindingObject = { [key]: value }

			const bindingParams = title ? { ...params, label: title } : params
			const binding = folder.addBinding(bindingObject, key, bindingParams)

			binding.on('change', (event) => {
				onChange?.(event)
			})

			return binding
		})

		if (!isInitializedRef.current) {
			isInitializedRef.current = true
		}
	}, [bladesRef, folder])

	return [refreshBindings]
}
