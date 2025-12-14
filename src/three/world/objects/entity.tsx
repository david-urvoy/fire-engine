import {
	Children,
	cloneElement,
	isValidElement,
	type PropsWithChildren,
	type ReactElement,
	type ReactNode,
} from 'react'
import { Controllable } from '../../../game'
import { Physic } from '../character/physics/physic'
import { Interactable } from './interactable/interactable'

type EntityProps = {
	children: ReactNode

	physic?: boolean | React.ComponentProps<typeof Physic>
	interactable?: boolean | React.ComponentProps<typeof Interactable>
	controllable?: boolean | React.ComponentProps<typeof Controllable>
}

/**
 *  physic
 *  controllable
 *  interactable
 */
export function Entity({
	physic = true,
	controllable = true,
	interactable = true,
	children,
}: PropsWithChildren & EntityProps) {
	const childArray = Children.toArray(children) as ReactElement[]

	// --------- Helpers ---------
	const findChild = <T,>(component: React.ComponentType<T>) =>
		childArray.find((c) => isValidElement(c) && c.type === component) as ReactElement<T> | undefined

	const orCreate = <T extends {}>(
		existing: ReactElement<T> | undefined,
		Component: React.ComponentType<T>,
		propOption: boolean | T | undefined,
	): ReactElement<T> | null => {
		if (existing) return existing
		if (!propOption) return null
		const props = propOption === true ? ({} as T) : propOption
		return <Component {...props} />
	}

	// --------- Récupération ou création ---------
	const physicComp = orCreate(findChild(Physic), Physic, physic)
	const interactableComp = orCreate(findChild(Interactable), Interactable, interactable)
	const controllableComp = orCreate(findChild(Controllable), Controllable, controllable)

	// --------- Construction de l’arbre final ---------
	let tree = children as ReactNode

	if (controllableComp) tree = cloneElement(controllableComp, {}, tree)
	if (interactableComp) tree = cloneElement(interactableComp, {}, tree)
	if (physicComp) tree = cloneElement(physicComp, {}, tree)

	return <>{tree}</>
}
