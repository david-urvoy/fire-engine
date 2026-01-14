import { Color } from 'three'
import type { Light } from '../../3d/world/environment/light/light'
import type { Time } from '../time'

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
	time: Omit<Time, 'day'>
	light: {
		ambient: Light
		directional: Light & { type: 'moon' | 'sun' }
	}
}
export const PERIODS: { [name in PeriodName]: Period } = {
	dawn: {
		name: 'dawn',
		time: { hour: 4, minute: 0 },
		light: {
			ambient: { color: new Color('#506886'), intensity: 0.2 },
			directional: { type: 'moon', color: new Color('#506886'), intensity: 0.1 },
		},
	},
	morning: {
		name: 'morning',
		time: { hour: 7, minute: 0 },
		light: {
			ambient: { color: new Color('#ebae52'), intensity: 0.2 },
			directional: { type: 'sun', color: new Color('#ebae52'), intensity: 0.2 },
		},
	},
	noon: {
		name: 'noon',
		time: { hour: 10, minute: 0 },
		light: {
			ambient: { color: new Color('#a5a247'), intensity: 0.4 },
			directional: { type: 'sun', color: new Color('#a5a247'), intensity: 0.5 },
		},
	},
	afternoon: {
		name: 'afternoon',
		time: { hour: 14, minute: 0 },
		light: {
			ambient: { color: new Color('#e8cc1e'), intensity: 0.4 },
			directional: { type: 'sun', color: new Color('#e8cc1e'), intensity: 0.5 },
		},
	},
	evening: {
		name: 'evening',
		time: { hour: 18, minute: 0 },
		light: {
			ambient: { color: new Color('#d88b55'), intensity: 0.3 },
			directional: { type: 'sun', color: new Color('#d88b55'), intensity: 0.2 },
		},
	},
	dusk: {
		name: 'dusk',
		time: { hour: 20, minute: 0 },
		light: {
			ambient: { color: new Color('#506886'), intensity: 0.2 },
			directional: { type: 'moon', color: new Color('#506886'), intensity: 0.1 },
		},
	},
	night: {
		name: 'night',
		time: { hour: 22, minute: 0 },
		light: {
			ambient: { color: new Color('#3a5676'), intensity: 0.2 },
			directional: { type: 'moon', color: new Color('#3a5676'), intensity: 0.1 },
		},
	},
}

export function Period({ hour: hours }: Time): PeriodName {
	return Object.values(PERIODS).findLast((period) => period.time.hour <= hours)?.name ?? 'night'
}
