import { Outlines } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import {
	Children,
	cloneElement,
	isValidElement,
	useEffect,
	type ComponentPropsWithoutRef,
	type ReactElement,
	type ReactNode,
	type RefObject,
} from 'react'
import { Mesh } from 'three'
import { useSnapshot } from 'valtio'
import { interactable } from './interactable.store'

type R3FChild = ReactElement<ThreeElements['mesh'] | ThreeElements['group']>

// Fonction récursive typée pour injecter Outlines
function injectOutlinesRecursively(
	child: R3FChild,
	active: Omit<Set<string>, 'add' | 'delete' | 'clear'>,
	style?: ComponentPropsWithoutRef<typeof Outlines>,
): ReactNode {
	if (!isValidElement(child)) return child

	const { type, props } = child
	const selected = (child.props.ref as RefObject<Mesh>)?.current?.uuid

	// Mesh → injecte Outlines
	if (type === 'mesh') {
		return cloneElement(
			child,
			{},
			<>
				<Outlines visible={active.has(selected)} color="hotpink" thickness={5} {...style} />
				{props.children}
			</>,
		)
	}

	// Group ou autre → traverse récursivement ses enfants
	if (props.children) {
		return cloneElement(
			child,
			{},
			Children.map(props.children, (c) =>
				isValidElement(c) ? injectOutlinesRecursively(c as R3FChild, active) : c,
			),
		)
	}

	return child
}

export function Interactable({
	children,
	...props
}: { children: R3FChild } & ComponentPropsWithoutRef<typeof Outlines>) {
	const ref = children.props.ref as RefObject<Mesh>

	const interactive = useSnapshot(interactable).active

	useEffect(() => {
		const obj = ref?.current
		if (!obj) return

		interactable.groups.add(obj.uuid)
		interactable._map.set(obj.uuid, obj)

		return () => {
			interactable.groups.delete(obj.uuid)
			interactable._map.delete(obj.uuid)
		}
	}, [ref])

	// cloneElement pour injecter Outlines à l'intérieur du mesh
	return Children.map(children, (c) =>
		isValidElement(c) ? injectOutlinesRecursively(c as R3FChild, interactive, props) : c,
	)
}
