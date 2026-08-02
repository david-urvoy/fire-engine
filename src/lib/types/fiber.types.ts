import type { ThreeElements, ThreeEvent } from '@react-three/fiber'

export type GroupProps = Omit<ThreeElements['group'], 'id' | 'onClick' | 'children'> & {
	onClick?: (object: ThreeEvent<MouseEvent>) => void
}
