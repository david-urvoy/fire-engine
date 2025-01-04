import { Vector3 } from 'three'
import { proxy } from 'valtio'
import { time } from './time-store'

export const light = proxy({
	position: new Vector3(time.isDay ? (12 * 60 - (time.hours * 60 + time.minutes)) / 20 : 5, 50, 5),
})
