import { type PropsWithChildren, useState } from 'react'

export function HudOption({
	index,
	total,
	hudSize,
	action,
	children,
}: PropsWithChildren<{ index: number; total: number; hudSize: number; action?: () => void }>) {
	const [mouseOver, setMouseOver] = useState(false)

	const hoverRatio = 1.1
	const arcGap = (1 / 2000) * hudSize
	const arcAngle = total <= 3 ? (2 * Math.PI) / 3 : (2 * Math.PI) / total
	const arcOffset = Math.PI / 2 + arcAngle / 2

	const rotation = (2 * Math.PI * index) / total - arcOffset
	const [innerRadius, baseOuterRadius] = [hudSize * 0.4, hudSize * 0.9]
	const middleRadius = (innerRadius + baseOuterRadius) / 2
	const outerRadius = baseOuterRadius * (mouseOver ? hoverRatio : 1)

	const textRotation = rotation + arcAngle / 2
	const dMiddleRadius = middleRadius * (hoverRatio - 1)

	const [xAngularProjection, yAngularProjection] = [Math.cos(textRotation), Math.sin(textRotation)]
	const [x, y] = [
		hudSize + middleRadius * xAngularProjection,
		hudSize + middleRadius * yAngularProjection,
	]
	const [dx, dy] = [dMiddleRadius * xAngularProjection, dMiddleRadius * yAngularProjection]

	return (
		<>
			<path
				d={`
				M ${innerRadius * Math.cos(arcGap)} ${innerRadius * Math.sin(arcGap)}
				L ${outerRadius * Math.cos(arcGap / 2)} ${outerRadius * Math.sin(arcGap / 2)}
				A ${outerRadius} ${outerRadius} 0 0 1 ${outerRadius * Math.cos(arcAngle - arcGap / 2)} ${outerRadius * Math.sin(arcAngle - arcGap / 2)}
				L ${innerRadius * Math.cos(arcAngle - arcGap)} ${innerRadius * Math.sin(arcAngle - arcGap)}
				A ${innerRadius} ${innerRadius} 0 0 0 ${innerRadius * Math.cos(arcGap)} ${innerRadius * Math.sin(arcGap)}
			`}
				className="animate-pulse fill-sky-200 stroke-sky-950 duration-500 ease-in-out hover:animate-none hover:fill-sky-800"
				style={{
					rotate: `${rotation}rad`,
					translate: '50% 50%',
				}}
				strokeWidth="1"
				fillOpacity=".7"
				onClick={(event) => {
					action?.()
					event.stopPropagation()
				}}
				onKeyDown={() => {}}
				onMouseEnter={() => setMouseOver(true)}
				onMouseLeave={() => setMouseOver(false)}
			/>
			<text
				x={x}
				y={y + 1}
				textAnchor="middle"
				className="pointer-events-none cursor-default duration-500 ease-in-out select-none"
				style={{
					...(mouseOver && {
						translate: `${dx}px ${dy}px`,
					}),
				}}
			>
				{children}
			</text>
		</>
	)
}
