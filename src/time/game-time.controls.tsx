import { useControls } from 'leva'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { gameTime } from './game-time.store'

export function GameTimeControls() {
	const { GAME_SPEED } = useSnapshot(gameTime)

	const { 'Speed Ratio': timeSpeedRatio } = useControls(
		'🕒 Time',
		{
			'Speed Ratio': { value: GAME_SPEED, min: 0, max: 100, step: 1 },
		},
		{ collapsed: true },
	)

	useEffect(() => {
		gameTime.GAME_SPEED = timeSpeedRatio
	}, [timeSpeedRatio])

	return null
}
