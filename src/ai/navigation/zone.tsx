import { CuboidCollider, type CuboidColliderProps } from '@react-three/rapier'
import { createContext, useState, type PropsWithChildren } from 'react'

import type { GroupProps } from '../../lib'
import type { PointOfInterest } from './point-of-interest/point-of-interest.model'

type ZoneContextType = {
	pointsOfInterest: Set<PointOfInterest>
	addPointOfInterest: (PointOfInterest: PointOfInterest) => void
}

const ZoneContext = createContext<ZoneContextType | null>(null)

export function Zone({ children, ...props }: PropsWithChildren<GroupProps>) {
	const [pointsOfInterest, setPointsOfInterest] = useState(new Set<PointOfInterest>())

	return (
		<ZoneContext.Provider
			value={{
				addPointOfInterest: (pointOfInterest: PointOfInterest) =>
					setPointsOfInterest((prev) => new Set(prev).add(pointOfInterest)),
				pointsOfInterest,
			}}
		>
			<group {...props}>{children}</group>
		</ZoneContext.Provider>
	)
}

export function ZoneSensor(props: CuboidColliderProps) {
	return (
		<CuboidCollider
			{...props}
			sensor
			activeCollisionTypes={8704}
			onIntersectionEnter={({ rigidBody }) =>
				console.log(((rigidBody?.userData as { id: string }) || undefined)['id'])
			}
			onIntersectionExit={() => console.log('exited')}
		/>
	)
}
