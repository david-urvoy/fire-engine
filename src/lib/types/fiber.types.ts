import type { ThreeElements, ThreeEvent } from '@react-three/fiber'

export type MeshProps = Omit<ThreeElements['mesh'], 'onClick'> & {
	onClick?: (object: ThreeEvent<MouseEvent>) => void
}
