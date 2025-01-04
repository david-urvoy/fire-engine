import type { Light } from '../light'
import type { Time } from './time'

/**
 * night = white ~null
 * dawn = yellow low
 * morning = orange medium
 * day = white/yellow high
 * evening = orange/red low
 * dusk = white/blue very low
 */
export type PeriodName = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'dusk' | 'night'
export interface Period {
	name: PeriodName
	time: Omit<Time, 'days' | 'tick'>
	light: {
		ambient: Light
		directional: Light & { type: 'moon' | 'sun' }
	}
}
export const PERIODS: { [name in PeriodName]: Period } = {
	dawn: {
		name: 'dawn',
		time: { hours: 4, minutes: 0 },
		light: {
			ambient: { color: '#506886', intensity: 0.2 },
			directional: { type: 'moon', color: '#506886', intensity: 0.1 },
		},
	},
	morning: {
		name: 'morning',
		time: { hours: 7, minutes: 0 },
		light: {
			ambient: { color: '#ebae52', intensity: 0.2 },
			directional: { type: 'sun', color: '#ebae52', intensity: 0.2 },
		},
	},
	noon: {
		name: 'noon',
		time: { hours: 10, minutes: 0 },
		light: {
			ambient: { color: '#a5a247', intensity: 0.4 },
			directional: { type: 'sun', color: '#a5a247', intensity: 0.5 },
		},
	},
	afternoon: {
		name: 'afternoon',
		time: { hours: 14, minutes: 0 },
		light: {
			ambient: { color: '#e8cc1e', intensity: 0.4 },
			directional: { type: 'sun', color: '#e8cc1e', intensity: 0.5 },
		},
	},
	evening: {
		name: 'evening',
		time: { hours: 18, minutes: 0 },
		light: {
			ambient: { color: '#d88b55', intensity: 0.3 },
			directional: { type: 'sun', color: '#d88b55', intensity: 0.2 },
		},
	},
	dusk: {
		name: 'dusk',
		time: { hours: 20, minutes: 0 },
		light: {
			ambient: { color: '#506886', intensity: 0.2 },
			directional: { type: 'moon', color: '#506886', intensity: 0.1 },
		},
	},
	night: {
		name: 'night',
		time: { hours: 22, minutes: 0 },
		light: {
			ambient: { color: '#3a5676', intensity: 0.2 },
			directional: { type: 'moon', color: '#3a5676', intensity: 0.1 },
		},
	},
}

export function Period({ hours }: Time): PeriodName {
	return Object.values(PERIODS).findLast((period) => period.time.hours <= hours)?.name ?? 'night'
}
