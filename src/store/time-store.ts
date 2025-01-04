import { Timer } from 'three-stdlib'
import { proxy } from 'valtio'
import { PERIODS, Period } from '../types/time/period'
import type { Time } from '../types/time/time'

export const GAME_TIME_SPEED_RATIO = 20
const TIME_STORE_KEY = 'game-time'

const INITIAL_TIME = localStorage.getItem(TIME_STORE_KEY)
	? (JSON.parse(localStorage.getItem(TIME_STORE_KEY) ?? '') as Time)
	: { days: 0, hours: 8, minutes: 0 }

export const time = proxy({
	...INITIAL_TIME,
	start: () => {
		const interval = setInterval(() => !time.frozen && tick(), (1000 * 60) / GAME_TIME_SPEED_RATIO)
		return () => clearInterval(interval)
	},
	frozen: false,
	freeze() {
		time.frozen = true
	},
	resume() {
		time.frozen = false
	},
	toggle() {
		time.frozen = !time.frozen
	},
	period: Period(INITIAL_TIME),
	save() {
		localStorage.setItem(TIME_STORE_KEY, JSON.stringify(time))
	},
	get isDay(): boolean {
		return PERIODS[this.period].light.directional.type === 'sun'
	},
})

export const timer = new Timer()
// timer.update()

function tick(onTick?: (time: Time) => void) {
	if (time.minutes !== 59) ++time.minutes
	else {
		time.minutes = 0
		if (time.hours !== 23) ++time.hours
		else {
			time.hours = 0
			++time.days
		}
	}
	time.period = Period(time)
	onTick?.(time)
}
