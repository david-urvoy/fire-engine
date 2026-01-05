import { CameraControls as CameraControlsType, Hud, OrthographicCamera } from '@react-three/drei'
import { type ThreeElements, useFrame, useThree } from '@react-three/fiber'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import {
	Group,
	Matrix4,
	Object3D,
	OrthographicCamera as OrthographicCameraImpl,
	Quaternion,
	Vector3,
} from 'three'
import { OrbitControls as OrbitControlsType } from 'three-stdlib'

type GizmoHelperContext = {
	tweenCamera: (direction: Vector3) => void
}

const Context = /* @__PURE__ */ createContext<GizmoHelperContext>({} as GizmoHelperContext)

export const useGizmoContext = () => {
	return useContext<GizmoHelperContext>(Context)
}

const turnRate = 2 * Math.PI // turn rate in angles per second
const dummy = /* @__PURE__ */ new Object3D()
const matrix = /* @__PURE__ */ new Matrix4()
const [q1, q2] = [/* @__PURE__ */ new Quaternion(), /* @__PURE__ */ new Quaternion()]
const target = /* @__PURE__ */ new Vector3()
const targetPosition = /* @__PURE__ */ new Vector3()

type ControlsProto = {
	update(delta?: number): void
	target: Vector3
}

export type GizmoHelperProps = ThreeElements['group'] & {
	alignment?:
		| 'top-left'
		| 'top-right'
		| 'bottom-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'center-right'
		| 'center-left'
		| 'center-center'
		| 'top-center'
	margin?: [number, number]
	renderPriority?: number
	autoClear?: boolean
	onUpdate?: () => void // update controls during animation
	// TODO: in a new major state.controls should be the only means of consuming controls, the
	// onTarget prop can then be removed!
	onTarget?: () => Vector3 // return the target to rotate around
}

const isOrbitControls = (controls: ControlsProto): controls is OrbitControlsType => {
	return controls && 'minPolarAngle' in (controls as OrbitControlsType)
}

const isCameraControls = (
	controls: CameraControlsType | ControlsProto,
): controls is CameraControlsType => {
	return controls && 'getTarget' in (controls as CameraControlsType)
}

export const GizmoHelper = ({
	alignment = 'bottom-right',
	margin = [80, 80],
	renderPriority = 1,
	onUpdate,
	children,
}: GizmoHelperProps) => {
	const size = useThree((state) => state.size)
	const mainCamera = useThree((state) => state.camera)
	const defaultControls = useThree((state) => state.controls) as unknown as ControlsProto
	const invalidate = useThree((state) => state.invalidate)
	const gizmoRef = useRef<Group>(null!)
	const virtualCam = useRef<OrthographicCameraImpl>(null!)

	const animating = useRef(false)
	const radius = useRef(0)
	const defaultUp = useRef(new Vector3(0, 0, 0))

	useEffect(() => {
		defaultUp.current.copy(mainCamera.up)
		dummy.up.copy(mainCamera.up)
	}, [mainCamera])

	const tweenCamera = useCallback(
		(direction: Vector3) => {
			animating.current = true
			radius.current = mainCamera.position.distanceTo(target)

			// Rotate from current camera orientation
			q1.copy(mainCamera.quaternion)

			// To new current camera orientation
			targetPosition.copy(direction).multiplyScalar(radius.current).add(target)

			dummy.lookAt(targetPosition)
			q2.copy(dummy.quaternion)
			invalidate()
		},
		[mainCamera, invalidate],
	)

	useFrame((_, delta) => {
		if (virtualCam.current && gizmoRef.current) {
			// Animate step
			if (animating.current) {
				if (q1.angleTo(q2) < 0.01) {
					animating.current = false
					// Orbit controls uses UP vector as the orbit axes,
					// so we need to reset it after the animation is done
					// moving it around for the controls to work correctly
					if (isOrbitControls(defaultControls)) {
						mainCamera.up.copy(defaultUp.current)
					}
				} else {
					const step = delta * turnRate
					// animate position by doing a slerp and then scaling the position on the unit sphere
					q1.rotateTowards(q2, step)
					// animate orientation
					mainCamera.up.set(0, 1, 0).applyQuaternion(q1).normalize()
					mainCamera.quaternion.copy(q1)

					if (isCameraControls(defaultControls))
						defaultControls.setPosition(
							mainCamera.position.x,
							mainCamera.position.y,
							mainCamera.position.z,
						)

					if (onUpdate) onUpdate()
					else if (defaultControls && defaultControls.update) defaultControls.update(delta)
					invalidate()
				}
			}

			// Sync Gizmo with main camera orientation
			matrix.copy(mainCamera.matrix).invert()
			gizmoRef.current?.quaternion.setFromRotationMatrix(matrix)
		}
	})

	const gizmoHelperContext = useMemo(() => ({ tweenCamera }), [tweenCamera])

	// Position gizmo component within scene
	const [marginX, marginY] = margin
	const x = alignment.endsWith('-center')
		? 0
		: alignment.endsWith('-left')
			? -size.width / 2 + marginX
			: size.width / 2 - marginX
	const y = alignment.startsWith('center-')
		? 0
		: alignment.startsWith('top-')
			? size.height / 2 - marginY
			: -size.height / 2 + marginY

	return (
		<Hud renderPriority={renderPriority}>
			<Context.Provider value={gizmoHelperContext}>
				<OrthographicCamera makeDefault ref={virtualCam} position={[0, 0, 200]} />
				<group ref={gizmoRef} position={[x, y, 0]}>
					{children}
				</group>
			</Context.Provider>
		</Hud>
	)
}
