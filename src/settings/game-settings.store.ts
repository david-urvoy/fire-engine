import { proxy } from 'valtio'

export const isDev = import.meta.env.MODE === 'development'

export const settings = proxy({
	shouldPauseOnBlur: !isDev,
})
