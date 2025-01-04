import { button, folder, useControls } from 'leva'
import { type PropsWithChildren, useRef } from 'react'
import { useSnapshot } from 'valtio'
import { game } from '../store/game-store'
import { time } from '../store/time-store'
import type { Time } from '../types/time/time'

export function Interface({ children }: PropsWithChildren) {
	return (
		<div className="pointer-events-none fixed top-0 left-0 z-50 h-full w-full">
			<Clock />
			<DebugUI />
			{children}
		</div>
	)
}

function Clock() {
	const timeRef = useRef<HTMLDivElement>(null)
	const { days, hours, minutes } = useSnapshot(time)

	useControls(
		'Debug',
		{
			Time: folder({
				Time: {
					value: hours,
					min: 0,
					max: 23,
					step: 1,
					label: 'Change time',
					onEditEnd: (hours) => {
						time.hours = hours
					},
				},
			}),
		},
		{ collapsed: true, order: 100 },
	)

	return (
		<div
			ref={timeRef}
			className="absolute left-0 w-full select-none bg-amber-800 bg-opacity-50 py-5 text-center font-bebas text-7xl text-yellow-500"
		>
			{timeToString({ days, hours, minutes })}
		</div>
	)
}

function DebugUI() {
	const { toggle } = useSnapshot(time)
	const { debug } = useSnapshot(game)

	useControls('Debug', { Time: folder({ 'Pause/Resume': button(toggle) }) }, { collapsed: true, order: 100 })

	return <div className="absolute top-20 right-1/4">{JSON.stringify(debug)}</div>
}

function timeToString({ hours, minutes }: Time) {
	return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')}`
}
