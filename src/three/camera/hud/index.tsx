import { GizmoHelper } from './gizmo/gizmo-helper'
import { GizmoViewport } from './gizmo/gizmo-viewport'

export function Hud({
	renderPriority = 1,
	children,
}: {
	renderPriority?: number
	children?: React.ReactNode
}) {
	return (
		<GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={renderPriority}>
			<GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
			{children}
		</GizmoHelper>
	)
}
