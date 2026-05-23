import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { proxy } from 'valtio'

import { game } from '../game'
import { Tweaks } from '../ui'
import { type PeriodName, Period, PERIODS } from './periods/period'
import type { Time } from './time'

const TIME_STORE_KEY = 'game-time'

const hasLocalStorage = typeof localStorage !== 'undefined'

function getInitialTime(): Time {
	if (!hasLocalStorage) return { day: 0, hour: 8, minute: 0 }

	try {
		const raw = localStorage.getItem(TIME_STORE_KEY)
		if (!raw) return { day: 0, hour: 8, minute: 0 }
		return JSON.parse(raw) as Time
	} catch {
		return { day: 0, hour: 8, minute: 0 }
	}
}

const INITIAL_TIME = getInitialTime()

export const gameTime = proxy({
	day: INITIAL_TIME.day,
	hour: INITIAL_TIME.hour,
	minute: INITIAL_TIME.minute,
	GAME_SPEED: 1,
	_frozen: game.isPaused,
	get frozen() {
		return game.isPaused || this._frozen
	},
	freeze() {
		gameTime._frozen = true
	},
	resume() {
		gameTime._frozen = false
	},
	toggle() {
		gameTime._frozen = !gameTime._frozen
	},
	save() {
		if (!hasLocalStorage) return

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

function increment(minutes: number = 1) {
	const totalMinutes = timeToMinutes(gameTime) + minutes

	gameTime.day = Math.floor(totalMinutes / (24 * 60))
	gameTime.hour = Math.floor((totalMinutes % (24 * 60)) / 60)
	gameTime.minute = totalMinutes % 60
}

if (typeof document !== 'undefined') {
	Tweaks.folder({ title: '🕒 Time' })
		.addBinding({ 'Time Speed Ratio': gameTime.GAME_SPEED }, 'Time Speed Ratio', {
			min: 0,
			max: 100,
			step: 1,
		})
		.on('change', ({ value }) => {
			gameTime.GAME_SPEED = value
		})
}

function timeToMinutes(time: Time): number {
	return time.day * 24 * 60 + time.hour * 60 + time.minute
}

export function useGameTime() {
	const elapsed = useRef(0)

	useFrame((_, delta) => {
		if (gameTime.frozen) return

		const gameTimeDelta = delta * gameTime.GAME_SPEED
		elapsed.current += gameTimeDelta

		if (elapsed.current >= 1) {
			const floorElapsed = Math.floor(elapsed.current)
			increment(floorElapsed)
			elapsed.current = elapsed.current - floorElapsed
		}
	})
}
