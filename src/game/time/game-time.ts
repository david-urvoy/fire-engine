import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { proxy } from 'valtio'
import { useWindowFocus } from '../../lib/hooks/useWindowFocus'
import { Tweaks } from '../../ui'
import { Period, PERIODS, type PeriodName } from './periods/period'
import type { Time } from './time'
import { timer } from './timer'

const TIME_STORE_KEY = 'game-time'

const INITIAL_TIME = localStorage.getItem(TIME_STORE_KEY)
	? (JSON.parse(localStorage.getItem(TIME_STORE_KEY) ?? '') as Time)
	: { day: 0, hour: 8, minute: 0 }

export const gameTime = proxy({
	...INITIAL_TIME,
	GAME_SPEED: 1,
	frozen: false,
	freeze() {
		gameTime.frozen = true
	},
	resume() {
		gameTime.frozen = false
	},
	toggle() {
		gameTime.frozen = !gameTime.frozen
	},
	save() {
		const { day, hour, minute } = gameTime
		localStorage.setItem(
			TIME_STORE_KEY,
			JSON.stringify({
				day,
				hour,
				minute,
			}),
		)
	},
	get period(): PeriodName {
		return Period({ day: this.day, hour: this.hour, minute: this.minute })
	},
	get isDay(): boolean {
		return PERIODS[this.period].light.directional.type === 'sun'
	},
})

function _increment(minutes: number = 1) {
	const totalMinutes = timeToMinutes(gameTime) + minutes

	gameTime.day = Math.floor(totalMinutes / (24 * 60))
	gameTime.hour = Math.floor((totalMinutes % (24 * 60)) / 60)
	gameTime.minute = totalMinutes % 60
}

Tweaks.folder({ title: '🕒 Time' })
	.addBinding({ 'Time Speed Ratio': gameTime.GAME_SPEED }, 'Time Speed Ratio', {
		min: 0,
		max: 100,
		step: 1,
	})
	.on('change', ({ value }) => {
		gameTime.GAME_SPEED = value
	})

function timeToMinutes(time: Time): number {
	return time.day * 24 * 60 + time.hour * 60 + time.minute
}

export function useGameTime() {
	const visibility = useWindowFocus()
	const elapsed = useRef(0)

	useEffect(() => {
		if (!visibility) {
			timer.update()
			gameTime.freeze()
		} else {
			timer.reset()
			gameTime.resume()
		}
	}, [visibility])

	useFrame(() => {
		timer.update()

		if (!gameTime.frozen) {
			const gameTimeDelta = timer.getDelta() * gameTime.GAME_SPEED
			elapsed.current += gameTimeDelta
			if (elapsed.current >= 1) {
				const floorElapsed = Math.floor(elapsed.current)
				_increment(floorElapsed)
				elapsed.current = elapsed.current - floorElapsed
			}
		}
	})
}
