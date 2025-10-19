import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, type PropsWithChildren, type RefObject } from 'react'
import { Group, Quaternion, Vector3 } from 'three'
import { useSnapshot } from 'valtio'
import { Character } from '../../three'
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

export const ControlledCharacter: {
	velocity: Vector3
	orientation: Quaternion
	ref: RefObject<Group | null>
} = {
	velocity: new Vector3(),
	orientation: new Quaternion(),
	ref: { current: null },
}

export function Controlled({ children }: PropsWithChildren) {
	const groupRef = useRef<Group>(null)
	const npcControls = useRef({
		velocity: new Vector3(),
		orientation: new Quaternion(),
	})

	useEffect(() => {
		ControlledCharacter.ref = groupRef
	}, [])

	const isPlayerControlled = groupRef.current === ControlledCharacter.ref.current
	const { velocity, orientation } = isPlayerControlled ? ControlledCharacter : npcControls.current

	return (
		<Character velocity={velocity} orientation={orientation} position={[2.3, 2, 0.66]}>
			<group ref={groupRef} />
			{children}
		</Character>
	)
}

function usePlayerDirection() {
	const { isMobile } = useSnapshot(game)
	const control = isMobile ? gamepad : keyboard
	return control.direction
}

function useCharacterMove() {
	const direction = usePlayerDirection()
	useFrame(() => {
		game.debug = direction.x + ', ' + direction.y
		// set velocity to player direction
		const delta = timer.getDelta()
		ControlledCharacter.velocity
			.setX(direction.x)
			.setZ(direction.y)
			.applyQuaternion(ControlledCharacter.orientation)
			.setY(0)
			.multiplyScalar(7.5 * delta * 60)
	})
}

function useCameraFollowsTargetOrientation() {
	useFrame(({ camera }) => {
		// set orientation to camera direction
		ControlledCharacter.orientation.setFromUnitVectors(
			FORWARD,
			camera.getWorldDirection(new Vector3()).setY(0).negate().normalize(),
		)
	})
}

export function CameraTracking({ target }: { target?: RefObject<Vector3> } = {}) {
	useCameraFollowsTargetOrientation()
	useCharacterMove()

	useFrame(function cameraFollowsTargetPosition({ camera }) {
		const characterPosition = ControlledCharacter.ref.current?.getWorldPosition(target?.current ?? camera.position)

		if (target?.current && characterPosition)
			camera.position.sub(target.current).add(characterPosition)
	})

	return <></>
}
