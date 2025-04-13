import { type PropsWithChildren, useCallback, useRef } from 'react'
import { useSnapshot } from 'valtio'
import { game, gameTime } from '../game'
import type { Time } from '../game/time/time'
import { useTweaks } from './tweaks'

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
	const { days, hours, minutes, frozen, toggle } = useSnapshot(gameTime)

	const hoursRef = useRef({ time: hours })
	const [_, refresh] = useTweaks({
		folder: '🕒 Time',
		bindings: useCallback(
			(folder) => [
				folder.addBinding(hoursRef.current, 'time', { min: 0, max: 23, step: 1 }).on('change', ({ value }) => {
					if (Number.isNaN(value)) return
					gameTime.hours = value
				}),
				folder.addButton({ title: frozen ? 'Resume' : 'Pause' }).on('click', () => toggle()),
			],
			[frozen, toggle],
		),
	})

	hoursRef.current.time = gameTime.hours
	refresh()

	return (
		<div className="absolute left-0 w-full select-none bg-amber-800 bg-opacity-50 py-5 text-center font-bebas text-7xl text-yellow-500">
			{timeToString({ days, hours, minutes })}
		</div>
	)
}

function DebugUI() {
	const { debug } = useSnapshot(game)

	// const hoursRef = useRef(hours)
	// const [{ color, speed, weight }, refresh] = useTweaks({
	// 	folder: '🕒 Time',
	// 	bindings: useMemo(
	// 		() => ({
	// 			speed: { value: hours, params: { min: 0, max: 23, step: 1 } },
	// 			weight: { value: 16, params: { min: 0, max: 100 } },
	// 			color: { value: '#b1d5e5' },
	// 		}),
	// 		[hours],
	// 	),
	// })

	// gameTime.hours = speed
	// hoursRef.current = gameTime.hours
	// console.log('refreshing')
	// refresh()
	// console.log('values', color, speed, weight)

	return <div className="absolute top-20 right-1/4">{JSON.stringify(debug)}</div>
}

function timeToString({ hours, minutes }: Time) {
	return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')}`
}
