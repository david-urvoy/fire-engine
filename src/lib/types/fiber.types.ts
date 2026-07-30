import type { ThreeElements, ThreeEvent } from '@react-three/fiber'

export type GroupProps = Omit<ThreeElements['group'], 'onClick'> & {
	onClick?: (object: ThreeEvent<MouseEvent>) => void
}
