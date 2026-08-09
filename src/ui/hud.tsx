import { type PropsWithChildren } from 'react'

import { GizmoHelper } from './hud/gizmo/gizmo-helper'
import { GizmoViewport } from './hud/gizmo/gizmo-viewport'

export function Hud({
	renderPriority = 1,
	children,
}: PropsWithChildren<{
	renderPriority?: number
}>) {
	return (
		<>
			<GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={renderPriority}>
				<GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
				{children}
			</GizmoHelper>
		</>
	)
}
