import { useEffect, useRef } from 'react'
import { Group, Quaternion, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { controlled } from '../entity/entity.store'
import { game } from '../game.store'
import { useFullscreen } from './bindings/fullscreen'
import { Gamepad } from './input/gamepad/gamepad'
import { KeyboardControls } from './input/keyboard/keyboard-controls'
import { Keymap } from './input/keyboard/keymap'

export function Controls() {
	const { isMobile } = useSnapshot(game)
	useFullscreen()

	return isMobile ? <Gamepad /> : <KeyboardControls map={Keymap} />
}

export function Controllable({ id }: { id: string }) {
	const ref = useRef<Group>(null)

	useEffect(() => {
		controlled.controlled = id
		controlled.entities[id] = {
			ref,
			velocity: new Vector3(),
			orientation: new Quaternion(),
		}
	}, [id, ref])

	return <group ref={ref} />
}

export function useControlled(name: string) {
	const groupRef = useRef<Group>(null)

	controlled.controlled = name
	controlled.entities[name] = {
		ref: groupRef,
		velocity: new Vector3(),
		orientation: new Quaternion(),
	}

	const isControlled = controlled.controlled === name
	const { velocity, orientation } = controlled.entities[name]

	return { velocity, orientation, isControlled, ref: groupRef }
}
