import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import { proxy } from 'valtio'
import { useWindowFocus } from '../useWindowFocus'
import { PERIODS, Period } from './period'
import type { Time } from './time'
import { timer } from './timer'

const GAME_TIME_SPEED_RATIO = 20
const TIME_STORE_KEY = 'game-time'

const INITIAL_TIME = localStorage.getItem(TIME_STORE_KEY)
	? (JSON.parse(localStorage.getItem(TIME_STORE_KEY) ?? '') as Time)
	: { days: 0, hours: 8, minutes: 0 }

export const gameTime = proxy({
	...INITIAL_TIME,
	start() {
		const interval = setInterval(() => !gameTime.frozen && tick(), (1000 * 60) / GAME_TIME_SPEED_RATIO)
		return () => clearInterval(interval)
	},
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
	period: Period(INITIAL_TIME),
	save() {
		localStorage.setItem(TIME_STORE_KEY, JSON.stringify(gameTime))
	},
	get isDay(): boolean {
		return PERIODS[this.period].light.directional.type === 'sun'
	},
})

function tick(onTick?: (time: Time) => void) {
	if (gameTime.minutes !== 59) ++gameTime.minutes
	else {
		gameTime.minutes = 0
		if (gameTime.hours !== 23) ++gameTime.hours
		else {
			gameTime.hours = 0
			++gameTime.days
		}
	}
	gameTime.period = Period(gameTime)
	onTick?.(gameTime)
}

export function useGameTime() {
	// const controls = useMoveControl()

	// useEffect(() => {
	// 	const unsubscribeTime = time.start()
	// 	const unsubscribeKeys = subscribeKeys(
	// 		({ save }) => ({ save }),
	// 		({ save: saveKey }) => {
	// 			const { alt } = getKeys()
	// 			if (alt && saveKey) {
	// 				time.save()
	// 				console.log('saved !')
	// 			}
	// 		},
	// 	)
	// 	return () => {
	// 		unsubscribeTime()
	// 		unsubscribeKeys()
	// 	}
	// }, [subscribeKeys, getKeys])
	const visibility = useWindowFocus()

	useEffect(() => gameTime.start(), [])
	useEffect(() => {
		if (!visibility) {
			timer.update()
			gameTime.freeze()
		} else {
			timer.reset()
			gameTime.resume()
		}
	}, [visibility])

	useFrame(() => timer.update())
}
