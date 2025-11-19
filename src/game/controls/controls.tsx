import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, type RefObject } from 'react'
import { Group, Quaternion, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { controlled } from '../entity/entity.store'
import { FORWARD, game } from '../game.store'
import { timer } from '../time/timer'
import { Gamepad, gamepad } from './actions/gamepad/gamepad'
import { KeyboardControls } from './actions/keyboard/keyboard-controls'
import { keyboard } from './actions/keyboard/keyboard.store'
import { Keymap } from './actions/keyboard/keymap'
import { useFullscreen } from './fullscreen'

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

	return (
		<group ref={ref} />
	)
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

function usePlayerDirection() {
	const { isMobile } = useSnapshot(game)
	const control = isMobile ? gamepad : keyboard
	return control.direction
}

function useCharacterMove() {
	const direction = usePlayerDirection()
	const char = useSnapshot(controlled).entities['player']

	useFrame(() => {
		game.debug = direction.x + ', ' + direction.y
		// set velocity to player direction
		const delta = timer.getDelta()
		char?.velocity
			.setX(direction.x)
			.setZ(direction.y)
			.applyQuaternion(char?.orientation)
			.setY(0)
			.multiplyScalar(7.5 * delta * 60)
	})
}

function useCameraFollowsTargetOrientation() {
	const char = useSnapshot(controlled).entities['player']
	useFrame(({ camera }) => {
		// set orientation to camera direction
		char?.orientation.setFromUnitVectors(
			FORWARD,
			camera.getWorldDirection(new Vector3()).setY(0).negate().normalize(),
		)
	})
}

export function CameraTracking({ target }: { target?: RefObject<Vector3> } = {}) {
	useCameraFollowsTargetOrientation()
	useCharacterMove()
	const ref = useSnapshot(controlled).entities['player']?.ref

	useFrame(function cameraFollowsTargetPosition({ camera }) {
		const characterPosition = ref?.current?.getWorldPosition(target?.current ?? camera.position)

		if (target?.current && characterPosition)
			camera.position.sub(target.current).add(characterPosition)
	})

	return <></>
}
