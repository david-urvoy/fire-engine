import { type ThreeElements, type ThreeEvent, useFrame } from '@react-three/fiber'
import type React from 'react'
import { type RefObject, useRef, useState } from 'react'
import { Quaternion, Vector3 } from 'three'
import { characterDimensions } from '../../store/game-store'
import { InteractZone } from '../objects/interact-zone/interact-zone'
import type { Animations } from './animation/animate'
import { useWanderingBehavior } from './npc/behavior/wandering'
import { Character } from './physics/character'

export function NPC({
	position,
	CharacterComponent,
	...props
}: ThreeElements['group'] & {
	position: Vector3
	CharacterComponent: (
		props: { animationsRef: RefObject<Animations | undefined> } & ThreeElements['group'],
	) => React.JSX.Element
}) {
	const animations = useRef<Animations>(undefined)
	const [hovered, hover] = useState(false)
	const target = { position: new Vector3(0, 0, 10), speed: 10 }
	const linvel = new Vector3()

	useWanderingBehavior(target.position, animations.current)

	useFrame((_, delta) => {
		if (position.distanceTo(target.position) > delta * target.speed + 0.3) {
			linvel.copy(target.position).sub(position).setY(0).normalize().multiplyScalar(target.speed)
		} else linvel.set(0, 0, 0)
	})

	const handlePointerEvent = (isPointerOver: boolean) => (e: ThreeEvent<PointerEvent>) => {
		// if (player.position.distanceTo(position) < 10)
		hover(isPointerOver)
		e.stopPropagation()
	}
	const handlePointer: ThreeElements['group'] = {
		onPointerOver: handlePointerEvent(true),
		onPointerOut: handlePointerEvent(false),
	}

	return (
		<Character orientation={new Quaternion()} position={position} velocity={linvel}>
			<CharacterComponent {...handlePointer} animationsRef={animations} castShadow {...props} />
			<InteractZone
				offset={characterDimensions.halfHeight + characterDimensions.radius}
				hovered={hovered}
				{...handlePointer}
			/>
		</Character>
	)
}
